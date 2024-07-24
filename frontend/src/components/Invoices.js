import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Row, Col, NavItem, InputGroup, InputGroupText, Button, Input } from "reactstrap";
import MainNavbar from './Navbar';
import InvTotal from './InvoicesProductTotal';


function Invoices({tomorrow}) {
    const [numbers, setNumbers] = useState({});
    const [err, setErr] = useState(null);
    // const [dayValue, setDayValue] = useState("Today");
    // const [dayInput, setDayInput] = useState("Today")
    let dayValue = "today";
    if (tomorrow) {
        dayValue = "tomorrow"
    }
    
    function fetchAll() {
        axios.get("/get_ks_total").then((res) => {
            setNumbers((prev) => (
                {...prev, "kegshoeTotal": res.data}
                ));
            setErr("Collecting Kegshoe/Ekos totals...");
            axios.get("/get_ekos_total")
            .then((res) => {
                setNumbers((prev) => (
                    {...prev, "ekosTotal": res.data}
                ));
                setErr("Collecting deliveries total...");
                axios.get(`/get_invoices/${dayValue}`)
                .then((res) => {
                    setNumbers((prev) => (
                        {...prev, "deliveriesTotal": res.data}
                        ));
                    setErr(null);
                }).catch((err) => setErr(err.message));
            }).catch((err) => setErr(err.message));
        }).catch((err) => setErr(err.message));
    }
      

    useEffect(() => {
        fetchAll();
    }, [])

    // const dayInputBtn = (
    //         <NavItem>
    //             <InputGroup>
    //                 <InputGroupText>
    //                     <Input placeholder="Delivery date: 'Today'" onChange={ (e) => setDayInput(e.target.value)}/>
    //                     <Button onClick={ () => setDayValue(dayInput) } />
    //                 </InputGroupText>
    //             </InputGroup>
    //         </NavItem>
    //     )


    return (
      <>
        <MainNavbar />
        {err? 
        <Row className='mt-1'>
            <Col sm={{offset: 5, size: 3}} xs={{offset: 1, size: 11}}>
                <h6>{err}</h6>
            </Col>
        </Row> : null}

        {Object.keys(numbers).length === 0 ?
        <Row className='mt-1'>
            <Col sm={{offset: 5, size: 1}} xs={{offset: 2, size: 2}}>
                <h1>Loading...</h1>
            </Col>
        </Row> : <InvTotal data={numbers}/>}
      </>
    )

}

export default Invoices;