import { applyMiddleware, createStore, Reducer, Store } from "redux"
import { createEpicMiddleware } from "redux-observable"
import { composeWithDevTools } from "@redux-devtools/extension"
import { ActionTypes } from "./actionTypes"
import { Settings } from "./storeTypes"
import { rootEpic } from "../epics"

export const configureStore = (
  initialSettings: Settings,
  rootReducer: Reducer<Settings, ActionTypes>
): Store<Settings, ActionTypes> => {
  const epicMiddleware = createEpicMiddleware<
    ActionTypes,
    ActionTypes,
    Settings,
    any
  >()

  const store = createStore(
    rootReducer,
    initialSettings,
    composeWithDevTools(applyMiddleware(epicMiddleware))
  )

  epicMiddleware.run(rootEpic)
  return store
}
