import {
  configureStore, ThunkAction, Action, combineReducers,
} from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import { AuthState, authSlice } from './authSlice'
import { AdminState, adminSlice } from './adminSlice'

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
}

const reducers = combineReducers({
  [authSlice.name]: persistReducer<AuthState, any>(persistConfig, authSlice.reducer),
  [adminSlice.name]: persistReducer<AdminState, any>(persistConfig, adminSlice.reducer),
})

// export const store = configureStore({
//   reducer: reducers,
//   devTools: false,
// })
// 3. Configure the store with middleware fix
export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions to avoid console warnings
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
      },
    }),
  devTools: true,
  
});
const makeStore = () => store

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
AppState,
unknown,
Action
>

// export const wrapper = createWrapper<AppStore>(makeStore);
export const persistor = persistStore(store)
