// @ts-check

import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  tseslint.configs.stylistic,
  tseslint.configs.strict,
  {
    ignores: ["dist", "infra", "scripts"]
  }
)
