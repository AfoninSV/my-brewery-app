import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody,Form, FormGroup, Input, NavItem, NavLink, FormFeedback } from 'reactstrap';

function LoginFormButton() {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [loginAlarm, setLoginAlarm] = useState(false);
    const [passwordAlarm, setPasswordAlarm] = useState(false);

    // Written onChange
    let email = null;
    let password = null;

    const onSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            let login_data = {
                "email": email,
                "password": password
            };
            axios.post("/auth/login", login_data).then((res) => {
                const user = res.data.user;
                if (res.status === 200) {
                    toggle();
                    sessionStorage.setItem("name", user.name);
                    sessionStorage.setItem("email", user.email);
                    sessionStorage.setItem("cameraId", user.cameraId);
                    window.location.reload(true);
                }
            }).catch(function (error) {
                switch (error.request.status){
                    case 403:
                        setLoginAlarm(true);
                        break;
                    case 401:
                        setPasswordAlarm(true);
                        break;
                }
            });
        }
    }

    return(
        <div>
            <NavItem onClick={toggle}>
                <NavLink>
                    Login
                </NavLink>
            </NavItem>
            <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Login</ModalHeader>
            <ModalBody>
            <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Input onChange={(e) => email = e.target.value}
                        placeholder='Email'
                        type='email'
                        invalid={loginAlarm}/>
                        <FormFeedback>
                            Email not registereg
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Input onChange={(e) => password = e.target.value}
                        placeholder='Password'
                        invalid={passwordAlarm}
                        type='password'/>
                        <FormFeedback>
                            Wrong password
                        </FormFeedback>
                    </FormGroup>
                    <Button color="primary" type='submit' className='me-3'>
                        Login
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
                </Form>
            </ModalBody>
            </Modal>
        </div>
    );
}

export default LoginFormButton;