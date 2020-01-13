import React from "react";
import {NavLink} from "react-router-dom";

const Header = () =>(
        <header className="superHeader">
            <h1>UMC</h1>
            <div className="linkContainer">
                <NavLink to="/" className="NLink" activeClassName="is-active" exact={true}>Main Page</NavLink>
                <NavLink to="/keymanager" className="NLink" activeClassName="is-active">Key Manager</NavLink>
            </div>
        </header>
    )
export default Header;