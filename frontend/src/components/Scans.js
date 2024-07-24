import React, {useState} from 'react'
import { Button, Row, Col, Container } from 'reactstrap';
import MainNavbar from './Navbar';
import Scanner from './scanner';
import CycleTable from './CycleTable';

function Scans() {
    const [ifKegScanner, setIfKegScanner] = useState(false);
    const [ifScanner, setIfScanner] = useState(false);
    const isLogged = sessionStorage.getItem("email");
    
    
    return (
      <>
        <MainNavbar />
        <Container>
          <Row>
            <Col className='text-center'>
              <Button className='col-6 mx-auto mb-3' color="warning" onClick={() => setIfScanner(!ifScanner)}>
                {ifScanner ? "Stop" : "Scan"}
              </Button>
              <Scanner blockName="singleScanner" scan={ifScanner} setScan={setIfScanner} needSubmit={false}/>
            </Col>
          </Row>
          <Row>
            {isLogged && (
              <Col className='text-center'>
                <Button className='col-6 mx-auto mb-3' color="warning" onClick={() => setIfKegScanner(!ifKegScanner)}>
                  {ifKegScanner ? "Stop" : "Scan kegs"}
                </Button>
                <Scanner blockName="kegScanner" scan={ifKegScanner} setScan={setIfKegScanner} needSubmit={true}/>
              </Col>
            )}

          </Row>
          <Row>
            <CycleTable/>
          </Row>
        </Container>
      </>
    )
}


export default Scans;