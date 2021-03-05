import React from 'react';
import { Provider } from 'react-redux';
import {persistor, store} from './store';
import SearchPage from "./templates/SearchPage";
import { PersistGate } from 'redux-persist/integration/react'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {SEARCH_PAGE} from "./common";
import { createBrowserHistory } from 'history';
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
                        <Route path={"/"} render={props => <DefaultPage {...props} exact/>}/>
                        <Route render={props => <SearchPage {...props} exact/>}/>
                    </Switch>
                    <ToastContainer/>
                </Router>
            </PersistGate>
        </Provider>
    );
  }
}