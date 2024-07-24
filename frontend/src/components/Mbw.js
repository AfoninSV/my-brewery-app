import { React, useState } from 'react'
import { Row, Col, InputGroup, Input, Alert } from 'reactstrap'
import MainNavbar from './Navbar';

function MBW() {
    const [inputValue, setInputValue] = useState("");

    const hrmCities = [
        "beaver bank",
        "bedford",
        "beechville",
        "clayton park",
        "clayton park west",
        "cole harbour",
        "cow bay",
        "dartmouth",
        "eastern passage",
        "fairview",
        "fall river",
        "fletchers lake",
        "halifax",
        "hammonds plains",
        "upper hammonds plains",
        "kinsac",
        "lake echo",
        "lakeside",
        "lakeview",
        "lucasville",
        "east preston",
        "north preston",
        "lower sackville",
        "middle sackville",
        "upper sackville",
        "shearwater",
        "spryfield",
        "still water lake",
        "tantallon",
        "upper tantallon",
        "timberlea",
        "waverley",
        "wellington",
        "windsor junction",
        "woodside",
        "goffs",
        "elmsdale",
        "enfield",
        "oakfield",
        "windsor junction"]

    return (
        <>
        <MainNavbar />
        <Row className='mt-1'>
            <Col xs={{ offset: 1, size: 10 }} md={{ offset: 3, size: 6 }}>
            <InputGroup>
                <Input className='mb-3' placeholder='City' type='text' 
                onChange={(e) => {
                    setInputValue(() => e.target.value.toLowerCase());
                }}></Input>
            </InputGroup>
                {(hrmCities.includes(inputValue.trim())) ? 
                <Alert color='primary'>For local delivery!</Alert> 
                : !(inputValue == "") && <Alert color='secondary'>For MBW!</Alert>    
                }
            </Col>
        </Row>
        </>
    )
}

export default MBW;