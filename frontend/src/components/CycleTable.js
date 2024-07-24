import {React, useEffect, useState} from "react";
import axios from "axios";
import { Row, Table, Pagination, PaginationItem, PaginationLink, InputGroup, Input, Button } from "reactstrap";

function CycleTable() {
    const [searchValue, setSearchValue] = useState(null);
    const [cycleData, setCycleData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(75);

    // PAGINATION: Calculate the index range for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cycleData.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getTable = () => {
        axios.get("/cycles").then((res) => {
            setCycleData(res.data);
        });
    }

    // Search for data for Table
    const makeSearch = (data) => {
        if (data !== "") {
            axios.get(`/cycle/${data}`).then(res => {
                setCycleData(res.data);
            });
        } else {
            getTable();
        }
    }

    // Grab data from server to make Table
    useEffect(() => {
        getTable();
    }, []);


    return (
        <Row className="justify-content-center">
            <InputGroup size="sm">
                <Input onBlur={(e) => setSearchValue(e.target.value)}/>
                <Button onClick={() => {
                    makeSearch(searchValue);
                    }} >
                    Search
                </Button>
                <Button onClick={ () => getTable() } 
                        className="ms-1">
                    Reset
                </Button>
            </InputGroup>
            <Table size="sm" responsive={true}>
                <thead>
                    <tr>
                        <th>
                            1
                        </th>
                        <th>
                            2
                        </th>
                        <th>
                            3
                        </th>
                        <th>
                            4
                        </th>
                        <th>
                            NAME
                        </th>
                        <th>
                            DATE
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((cycle) => {
                        // Parse the 'entries' string into a JSON object
                        const entries = JSON.parse(cycle.entries);

                        return (
                            <tr key={cycle.id}>
                                <td>{entries[0]}</td>
                                <td>{entries[1]}</td>
                                <td>{entries[2]}</td>
                                <td>{entries[3]}</td>
                                <td>{cycle.name}</td>
                                <td>{cycle.datetime}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center">
                <Pagination>
                    {Array.from({ length: Math.ceil(cycleData.length / itemsPerPage) }).map((_, index) => (
                        <PaginationItem key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                            <PaginationLink>
                                {index + 1} 
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                </Pagination>
            </div>
        </Row>
    )
}

export default CycleTable;