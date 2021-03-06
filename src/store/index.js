import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore} from 'redux-persist';
import rootReducer from '../reducers';

const enhancer = composeWithDevTools(applyMiddleware(ReduxThunk));
const store = createStore(rootReducer, enhancer);
const persistor = persistStore(store);

export {persistor, store};
