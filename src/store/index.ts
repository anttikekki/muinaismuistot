import {
  configureStore,
  createListenerMiddleware,
  ListenerEffectAPI,
  ListenerMiddlewareInstance,
  Store,
  TypedStartListening
} from "@reduxjs/toolkit"
import { ActionTypes } from "./actionTypes"
import { rootReducer } from "./rootReducer"
import { AppDispatch, Settings } from "./storeTypes"

let store: Store<Settings, ActionTypes>
let listenerMiddleware: ListenerMiddlewareInstance<Settings, AppDispatch>

export const createStore = (
  preloadedState: Settings
): Store<Settings, ActionTypes> => {
  listenerMiddleware = createListenerMiddleware<Settings, AppDispatch>()

  store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware)
  })
  return store
}

// Yksinkertaistettu tyypitys kuuntelijalle, koska aidot tyypitykset
// ovat monimutkaisia ja eivät rajaa Actioneitten tyyppiä tarpeeksi.
export interface StoreListener {
  predicate: (action: ActionTypes) => boolean
  effect: (
    action: ActionTypes,
    api: ListenerEffectAPI<Settings, AppDispatch>
  ) => void | Promise<void>
}
type StartListeningProps = Parameters<
  TypedStartListening<Settings, AppDispatch>
>[0]

export const addStoreListener = (listener: StoreListener): void => {
  listenerMiddleware.startListening(listener as StartListeningProps)
}
