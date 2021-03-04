import { combineReducers } from 'redux';
import { CommonReducer } from './CommonReducer';
import storage from 'redux-persist/lib/storage';
import {persistReducer} from "redux-persist";

const persistConfig = {
    key: 'isLoading',
    storage: storage,
    whitelist: ['isLoading'] // which reducer want to store
};
const rootReducer = combineReducers({
    common: persistReducer(persistConfig, CommonReducer),
});
export default rootReducer;