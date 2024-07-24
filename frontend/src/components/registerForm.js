import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Input, FormFeedback, NavItem, NavLink} from 'reactstrap';

function RegisterFormButton() {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    // name
    const [nameValid, setNameValid] = useState(true);
    const [nameCheck, setNameCheck] = useState(null);

    // email vars
    const [emailValid, setEmailValid] = useState(true);
    const [checkEmailName, setCheckEmailName] = useState(null);

    // password vars
    const [passwordValid, setPasswordValid] = useState(true);
    const [checkPassword, setCheckPassword] = useState(null);

    useEffect(() => {
        if (!modal) {
            setNameValid(true);
            setEmailValid(true);
            setPasswordValid(true);
        }
    }, [modal])

    // runs on name change
    useEffect(() => {
        switch (nameCheck) {
            case null:
                break;
            case "":
                setNameValid(false);
                break;
            default:
                setNameValid(true);
        }
    }, [nameCheck]);


    // runs on email change
    useEffect(() => {
        switch (checkEmailName) {
            case "":
                break
            case null:
                break;
            default:
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(checkEmailName)) {
                    axios.post("/auth/check_email", {"email": checkEmailName}).then((res) => {
                        if (res.status === 200) {
                            setEmailValid(true);
                        } else {
                            setEmailValid(false);
                        }
                    }).catch(function (error) {});
                } else {
                    setEmailValid(false);
                }

        }
    }, [checkEmailName]);

    // runs on password change
    useEffect(() => {
        if (checkPassword !== null) {
            switch (true) {
                case checkPassword === "":
                case checkPassword === "1234":
                case checkPassword.length < 6:
                    setPasswordValid(false);
                    break;
                default:
                    setPasswordValid(true);
            }
        }
    }, [checkPassword]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (nameCheck && checkEmailName && checkPassword && nameValid && emailValid && passwordValid) {
            toggle();
            let register_data = {
                "name": nameCheck,
                "email": checkEmailName,
                "password": checkPassword
            };
            axios.post("/auth/register", register_data).then((res) => {
                if (res.status === 201) {
                    sessionStorage.setItem("name", nameCheck);
                    sessionStorage.setItem("email", checkEmailName);
                    window.location.reload(true);
                }
            });
        }
    }


    return(
        <div>
            <NavItem onClick={toggle}>
                <NavLink>
                    Register
                </NavLink>
            </NavItem>
            <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Register</ModalHeader>
            <ModalBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Input 
                        onBlur={(e) => setNameCheck(e.target.value)}
                        placeholder='Name'
                        invalid={!nameValid} />
                        <FormFeedback>
                            Please write a name
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Input onBlur={(e) => setCheckEmailName(e.target.value)}
                        placeholder='Email'
                        type='email'
                        invalid={!emailValid}
                        />
                        <FormFeedback>
                            Email already in use
                        </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Input onInput={(e) => setCheckPassword(e.target.value)}
                        placeholder='Password'
                        type='password'
                        invalid={!passwordValid}
                        />
                        <FormFeedback>
                            Use stronger password
                        </FormFeedback>
                    </FormGroup>
                    <Button color="primary" type='submit' className='me-3'>
                        Sumbit
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

export default RegisterFormButton;