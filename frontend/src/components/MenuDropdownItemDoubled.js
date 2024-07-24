import React from "react";
import { Button, ButtonGroup, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function MenuDropdownItemDoubled({title, description, href, title2, description2, href2}) {
    return (
        <ButtonGroup vertical={true} className='col-12'>
            <UncontrolledDropdown className='col-12' group={true} direction='start'>
                <Button href={href} color='warning' size='lg' className='col-12'>{title}</Button>
                <DropdownToggle caret={true} color="warning"/>
                <DropdownMenu>
                    <DropdownItem text={true}>
                        {description}
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown className='col-12' group={true} direction='start'>
                <Button href={href2} color='warning' size='sm' outline={true} className='col-12'>{title2}</Button>
                <DropdownToggle caret={true} outline={true} color="warning"/>
                <DropdownMenu>
                    <DropdownItem text={true}>
                        {description2}
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </ButtonGroup>
    )
}

export default MenuDropdownItemDoubled;