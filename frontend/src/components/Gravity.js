import React, {useState} from "react";
import { Row, Col, Input, ListGroup, ListGroupItem } from "reactstrap";
import MainNavbar from "./Navbar";

function Gravity(){
    const [plato, setPlato] = useState([1]);
    const sg = (1 + (plato / (258.6 - ( (plato/258.2) * 227.1) ) )).toFixed(4);
    const min355 = (355 * sg).toFixed(2);
    const min473 = (473 * sg).toFixed(2);

    return (
        <>
          <MainNavbar />
            <Row>
              <Col xs={{ offset: 1, size: 10 }} md={{ offset: 3, size: 6 }}>
                <Input  type="number" placeholder="1.0 Plato" onChange={(e) => setPlato(e.target.value)}></Input>
                <ListGroup className="mt-3">
                    <ListGroupItem>
                        SG = {sg}
                    </ListGroupItem>
                    <ListGroupItem>
                      355ml min = {min355}
                    </ListGroupItem>
                    <ListGroupItem>
                      473ml min = {min473} 
                    </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
        </>

    )
}

export default Gravity;