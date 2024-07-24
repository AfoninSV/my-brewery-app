import {React} from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

function CamerasButton(props) {
    return <>
        <UncontrolledDropdown direction="up">
            <DropdownToggle color="light">
            Cameras
            <DropdownMenu>
                {props.videoDevices.map( (camera, index) => (
                <DropdownItem onClick={() => props.changeCamera(camera.deviceId)}>Camera #{index + 1}</DropdownItem>
                ))}
            </DropdownMenu>
            </DropdownToggle>
        </UncontrolledDropdown>
    </>
}

export default CamerasButton;