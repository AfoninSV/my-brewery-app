import { Navbar,Nav, NavItem, NavbarText, NavLink } from 'reactstrap';

import RegisterFormButton from './registerForm';
import LoginFormButton from './loginForm';
import LogoutButton from './Logout';

function MainNavbar() {
    var userName = sessionStorage.getItem("name");
    // console.log(addedButton);
    return  (
        <Navbar>
            <Nav>
                <NavItem><NavLink href='/' color='link'>Home</NavLink></NavItem>
                {/* {addedButton} */}
            </Nav>
            {!userName ? (
                <Nav>
                    <NavItem><RegisterFormButton/></NavItem>
                    <NavItem><LoginFormButton/></NavItem>
                </Nav>
                ) : (
                        <Nav>
                            <NavItem><LogoutButton/></NavItem>
                            <NavbarText className="ms-3">{userName}</NavbarText>
                        </Nav>
                )}
            
        </Navbar>
    )
}

export default MainNavbar;