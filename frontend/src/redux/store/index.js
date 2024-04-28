import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import userReducer from '../slices/userSlice'
import bookmarkReducer from '../slices/bookmarkSlice';

//combine all the reducers
const rootReducer = combineReducers({
    user: userReducer,
    bookmark: bookmarkReducer
});

//config persist
const persistConfig = {
    key: 'root',
    storage
}

//create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

//create the store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

//create persistor
const persistor = persistStore(store)

export {
    store,
    persistor
}