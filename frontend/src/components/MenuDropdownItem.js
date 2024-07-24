import React from "react";
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function MenuDropdownItem({title, description, href}) {
    return (
        <UncontrolledDropdown className='col-12 mb-2' group={true} direction='start'>
            <Button href={href} color='warning' size='lg' className='col-12'>{title}</Button>
            <DropdownToggle caret={true} color="warning"/>
            <DropdownMenu>
            <DropdownItem text={true}>
                {description}
            </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default MenuDropdownItem;