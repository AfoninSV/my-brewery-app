import {React} from "react";
import { Button, NavItem, NavLink } from "reactstrap";

function LogoutButton() {
    return (
        <NavItem>
            <NavLink onClick={ () => {
                sessionStorage.clear();
                window.location.reload(true);
            }}>
            Logout
            </NavLink>
        </NavItem>
    )
}

export default LogoutButton;