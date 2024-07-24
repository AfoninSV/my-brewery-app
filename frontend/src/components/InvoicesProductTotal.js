import React from 'react';
import { Row, Col, Table } from "reactstrap";

function InvTotal({ data }) {

    return (
        <>
        {data ? 
                <Row>
                    <Col xs={{ offset:1, size: 10}}>
                        <Table striped={true} size="sm" responsive={true} style={{ "white-space": "pre-line" }}>
                            <thead>
                                <tr>
                                    <th>
                                        title
                                    </th>
                                    <th>
                                        ekos
                                    </th>
                                    <th>
                                        kegshoe
                                    </th>
                                    <th>
                                        delivery
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.ekosTotal || {})?.map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                        <td>{data.kegshoeTotal?.[key] ?? ""}</td> 
                                        <td>{data.deliveriesTotal?.[key] ?? ""}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row> : null
        }

        </>
    )
}

export default InvTotal;