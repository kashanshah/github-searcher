import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DEFAULT_PAGE, SEARCH_PAGE } from "./common";
import { persistor, store} from './store';
import SearchPage from "./templates/SearchPage";
import DefaultPage from "./templates/DefaultPage";
export const history = createBrowserHistory();


export default class App extends React.Component {
  render() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router history={history}>
                    <Switch>
                        <Route path={SEARCH_PAGE} render={props => <SearchPage {...props} exact/>}/>
                        <Route path={DEFAULT_PAGE} render={props => <DefaultPage {...props} exact/>}/>
                        <Route render={props => <DefaultPage {...props} exact/>}/>
                    </Switch>
                    <ToastContainer/>
                </Router>
            </PersistGate>
        </Provider>
    );
  }
}