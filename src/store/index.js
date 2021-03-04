import {createStore, applyMiddleware, compose} from 'redux';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import {persistStore} from 'redux-persist';
import rootReducer from '../reducers';

const composeEnhancers =typeof window === 'object' &&window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose();
const enhancer = composeEnhancers(applyMiddleware(ReduxThunk, logger));
const store = createStore(rootReducer, enhancer);
const persistor = persistStore(store);
export {persistor, store};
