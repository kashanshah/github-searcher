import {combineReducers} from 'redux';
import storage from 'redux-persist/lib/storage';
import {persistReducer} from "redux-persist";
import {CommonReducer} from './CommonReducer';

const persistConfig = {
    key: 'isLoading',
    storage: storage,
};
const rootReducer = combineReducers({
    common: persistReducer(persistConfig, CommonReducer),
});

export default rootReducer;