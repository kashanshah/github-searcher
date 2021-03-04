import React from 'react';
import { Provider } from 'react-redux';
import {persistor, store} from './store';
import SearchPage from "./templates/SearchPage";
import { PersistGate } from 'redux-persist/integration/react'
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default class App extends React.Component {
  render() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SearchPage />
                <ToastContainer/>
            </PersistGate>
        </Provider>
    );
  }
}