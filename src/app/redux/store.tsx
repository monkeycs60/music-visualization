import { configureStore } from '@reduxjs/toolkit';
import audioSlice from './audioSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

const persistConfig = {
   key: 'root',
   storage,
};

const persistedReducer = persistReducer(persistConfig, audioSlice);

export const store = configureStore({
   reducer: {
      audio: persistedReducer,
   },
   middleware: [thunk],
});

export const persistor = persistStore(store);