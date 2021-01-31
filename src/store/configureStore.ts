import { applyMiddleware, createStore, Reducer, Store } from "redux"
import thunkMiddleware from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { ActionTypes } from "./actionTypes"
import { Settings } from "./storeTypes"

export const configureStore = (
  initialSettings: Settings,
  rootReducer: Reducer<Settings, ActionTypes>
): Store<Settings, ActionTypes> => {
  const middlewares = [thunkMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  const store = createStore(rootReducer, initialSettings, composedEnhancers)

  return store
}
