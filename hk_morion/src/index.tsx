import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter} from "react-router-dom";
import Store from "./store/store";
import Layout from "./components/protected_page/Layout/Layout";
import NavBar from "./components/NavBar/NavBar";

interface IStore {
    store:Store;
}

const store = new Store();

export const Context = createContext<IStore>({
    store,
})

ReactDOM.render(
    <HashRouter>
        <Layout/>
        <Context.Provider value={{store}}>
            <div className={"app"}><App /></div>
        </Context.Provider>
        <NavBar/>
    </HashRouter>
    ,
    document.getElementById('root')
);