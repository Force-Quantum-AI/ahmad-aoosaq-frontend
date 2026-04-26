import { configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './features/auth/auth.slice'
import businessSlice from './features/business/business.slice'
import { baseAPI } from './api/baseApi'
import { aiBaseAPI } from './api/aiBaseApi'
import projectIdentifierReducer from './features/projectIdentifier.slice'

const persistConfig = {
  key: 'auth',
  storage
}

const persistedReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    [aiBaseAPI.reducerPath]: aiBaseAPI.reducer,

    auth: persistedReducer,
    business: businessSlice,
    projectIdentifier: projectIdentifierReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
    .concat(baseAPI.middleware, aiBaseAPI.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);