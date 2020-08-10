import React, { useContext } from 'react';
import { Navbar, NavbarBrand, NavItem } from "reactstrap"
import { Link, NavLink } from "react-router-dom"
import { UserContext } from "../Context"


const Header = () => {
    const context = useContext(UserContext)
    return (
        <Navbar color="info" light>
            <NavbarBrand tag={Link} to="/SignUp" className="text-white">
                {context.user?.email ? context.user.email : ""}
                {context.user?.email ? context.user.id : ""}
            </NavbarBrand>
            <NavItem className="list-unstyled">
                <NavLink tag={Link} to="/SignUp" className="text-white">Sign up</NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <NavLink tag={Link} to="/SignIn" className="text-white">Sign in</NavLink>
            </NavItem>
        </Navbar>
    );
}

export default Header;