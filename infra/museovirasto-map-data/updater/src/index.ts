import { Container, getContainer } from "@cloudflare/containers"
import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers"
import { handleRequest } from "./request"
import { checkSourceFreshness, sendAlert } from "./alerts"

export type TargetEnvironment = "preview" | "production"

interface UpdateParameters {
  targetEnvironment?: TargetEnvironment
}

interface RunState {
  status: "idle" | "running" | "succeeded" | "failed"
  startedAt?: string
  finishedAt?: string
  targetEnvironment?: TargetEnvironment
  version?: string
  error?: string
}

export interface UpdaterEnv {
  UPDATE_CONTAINER: DurableObjectNamespace<MapDataUpdateContainer>
  UPDATE_WORKFLOW: Workflow<UpdateParameters>
  TARGET_ENV: TargetEnvironment
  BASE_URL: string
  CLOUDFLARE_API_TOKEN: string
  CLOUDFLARE_ACCOUNT_ID: string
  UPDATER_TOKEN: string
  ALERT_EMAIL: SendEmail
  ALERT_EMAIL_FROM: string
  ALERT_EMAIL_TO: string
  MAX_SOURCE_AGE_HOURS: string
}

export class MapDataUpdateContainer extends Container<UpdaterEnv> {
  defaultPort = 8080
  sleepAfter = "1m"
  enableInternet = true

  async getLastRun(): Promise<RunState> {
    return (await this.ctx.storage.get<RunState>("lastRun")) ?? { status: "idle" }
  }

  async runUpdate(input: {
    targetEnvironment: TargetEnvironment
    baseUrl: string
    apiToken: string
    accountId: string
  }): Promise<RunState> {
    const startedAt = new Date().toISOString()
    await this.ctx.storage.put<RunState>("lastRun", {
      status: "running",
      startedAt,
      targetEnvironment: input.targetEnvironment,
    })

    try {
      await this.start({
        enableInternet: true,
        envVars: {
          TARGET_ENV: input.targetEnvironment,
          UPDATE_MODE: "publish",
          BASE_URL: input.baseUrl,
          CLOUDFLARE_API_TOKEN: input.apiToken,
          CLOUDFLARE_ACCOUNT_ID: input.accountId,
        },
      })
      await this.startAndWaitForPorts(8080, { portReadyTimeoutMS: 60_000 })
      const response = await this.containerFetch(
        new Request("http://container/run", { method: "POST" }),
        8080,
      )
      const result = (await response.json()) as { ok?: boolean; output?: string; version?: string }
      if (!response.ok || !result.ok) throw new Error(result.output?.slice(-4000) || `Container returned HTTP ${response.status}`)

      const state: RunState = {
        status: "succeeded",
        startedAt,
        finishedAt: new Date().toISOString(),
        targetEnvironment: input.targetEnvironment,
        version: result.version,
      }
      await this.ctx.storage.put("lastRun", state)
      return state
    } catch (error) {
      const state: RunState = {
        status: "failed",
        startedAt,
        finishedAt: new Date().toISOString(),
        targetEnvironment: input.targetEnvironment,
        error: error instanceof Error ? error.message : String(error),
      }
      await this.ctx.storage.put("lastRun", state)
      throw error
    } finally {
      await this.destroy()
    }
  }
}

export class MapDataUpdateWorkflow extends WorkflowEntrypoint<UpdaterEnv, UpdateParameters> {
  async run(event: WorkflowEvent<UpdateParameters>, step: WorkflowStep): Promise<RunState> {
    const targetEnvironment = event.payload.targetEnvironment ?? this.env.TARGET_ENV
    if (targetEnvironment !== this.env.TARGET_ENV) throw new Error("Workflow cannot publish to another environment")

    try {
      return await step.do(
        "build, publish and verify Museovirasto map data",
        { retries: { limit: 1, delay: "5 minutes" }, timeout: "1 hour" },
        async () => getContainer(this.env.UPDATE_CONTAINER, "daily-update").runUpdate({
          targetEnvironment,
          baseUrl: this.env.BASE_URL,
          apiToken: this.env.CLOUDFLARE_API_TOKEN,
          accountId: this.env.CLOUDFLARE_ACCOUNT_ID,
        }),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      try {
        await sendAlert(
          this.env,
          `[muinaismuistot.info] Museoviraston päivitys epäonnistui`,
          `Ympäristö: ${targetEnvironment}\nWorkflow: ${event.workflowName}\nInstanssi: ${event.instanceId}\nVirhe: ${message}`,
        )
      } catch (alertError) {
        console.error("Failed to send update failure alert", alertError)
      }
      throw error
    }
  }
}

export default {
  async fetch(request: Request, env: UpdaterEnv): Promise<Response> {
    return handleRequest(request, env, () => getContainer(env.UPDATE_CONTAINER, "daily-update").getLastRun())
  },
  async scheduled(_controller: ScheduledController, env: UpdaterEnv): Promise<void> {
    await checkSourceFreshness(env)
  },
} satisfies ExportedHandler<UpdaterEnv>
