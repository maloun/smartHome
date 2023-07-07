import React, {useState} from 'react';
import {IDevice} from "../../../models/response/HomeResponse";
import {PopupRoom} from "./PopupRoom";
interface Interface {
    devices:IDevice[]
}

const RoomFirstView = ({devices}:Interface) => {
    const [popupIsOpen, setPopupIsOpen] = useState(false)
    const [popupData, setSetpopupData] = useState<IDevice>()

    const onClickHandler = (device:IDevice)=>{
        setPopupIsOpen(!popupIsOpen)
        setSetpopupData(device)
    }

    const DeviceList = devices?.map((device)=>{
        return(
            <div className={"room-deviceContainer"} data-deviceStatus={true}
                 onClick={()=>onClickHandler(device)}>
                <div className={"room-device-title"}>{device.name}</div>
                <div className={"room-device-id"}>id {device.id}</div>
                <img src={"/Pictures/imageDevice.png"}/>
            </div>
        )
    })

    return (
        <div className={"room-devices"}>
            {DeviceList}
            <PopupRoom
                handler={setPopupIsOpen}
                isOpen={popupIsOpen}
                data={popupData}
            />
        </div>
    );
};

export default RoomFirstView;