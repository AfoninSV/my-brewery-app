import React from 'react'
import MainNavbar from './components/Navbar';
import MenuDropdownItem from './components/MenuDropdownItem';
import MenuDropdownItemDoubled from './components/MenuDropdownItemDoubled';
import { ButtonGroup, Row, Col } from 'reactstrap';


function App() {

  return (
    <>
      <MainNavbar/>
      <Row>
        <Col className='text-center'>
          <ButtonGroup vertical={true} className='xs-col-10 col-6 mx-auto'>
            <MenuDropdownItem title="Scanner" description="Use to scan a barcode and see result, or login and scan kegs for cleaning log" href="/scanner" />
            <MenuDropdownItem title="Gravity" description="Transform beer density into Specific Gravity and see minimun amount for each can type" href="/gravity" />
            <MenuDropdownItem title="MBW" description="Type in a city name and see whether for local delivery or for MBW!" href="/mbw" />
            <MenuDropdownItemDoubled 
            title="Totals" description="See collected for you totals of kegs quantity from Ekos, Kegshoe and deliveries" href="/invoices/today"
            title2="Tomorrow" description2="Deliveries total for tomorrow" href2="/invoices/tomorrow" />
          </ButtonGroup>
        </Col>
      </Row>
    </>  
  );
};

export default App;
