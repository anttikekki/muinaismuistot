import { applyMiddleware, createStore, Reducer, Store } from "redux"
import thunkMiddleware from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { Settings } from "../common/types"
import { ActionTypes } from "./types"

export const configureStore = (
  preloadedState: Settings,
  rootReducer: Reducer<Settings, ActionTypes>
): Store<Settings, ActionTypes> => {
  const middlewares = [thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}
