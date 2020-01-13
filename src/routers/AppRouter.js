import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import MainPage from "../components/MainPage/Mainpage";
import Header from "../components/Header"
import KeyManager from "../components/KeyManager/KeyManager";

const AppRouter = ()=>
    (<BrowserRouter>
        <div>
            <Header/>
            <Switch>
                <Route path="/" component={MainPage} exact={true}></Route>
                <Route path="/keymanager" component={KeyManager}></Route>
            </Switch>
        </div>
    </BrowserRouter>
)

export default AppRouter;