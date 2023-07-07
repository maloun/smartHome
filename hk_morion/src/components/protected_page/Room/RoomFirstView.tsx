import React, {useState} from 'react';

const RoomFirstView = () => {
    const [popupIsOpen, setPopupIsOpen] = useState(false)



    return (
        <div className={"room-devices"}>
            <div className={"room-deviceContainer"} data-deviceStatus={true}
                 onClick={() => setPopupIsOpen(!popupIsOpen)}>
                <div className={"room-device-title"}>Термостат</div>
                <div className={"room-device-id"}>id 23424534</div>
                <div className={"room-device-lastInfo"}>Последняя информация 23.06 в 23:58</div>
                <img src={"/Pictures/imageDevice.png"}/>
            </div>

            <div className={"room-deviceContainer"} data-deviceStatus={false}>
                <div className={"room-device-title"}>Модель</div>
                <div className={"room-device-id"}>id 23424534</div>
                <div className={"room-device-lastInfo"}>Последняя информация 23.06 в 23:58</div>
                <img src={"/Pictures/imageDevice.png"}/>
            </div>
            <div className={"room-deviceContainer"} data-deviceStatus={false}>
                <div className={"room-device-title"}>Модель</div>
                <div className={"room-device-id"}>id 23424534</div>
                <div className={"room-device-lastInfo"}>Последняя информация 23.06 в 23:58</div>
                <img src={"/Pictures/imageDevice.png"}/>
            </div>


            <div className={"room-popup"} data-isOpen={popupIsOpen}>
                <div className={"room-popup-title"}>Модель</div>
                <div className={"room-popup-id"}>id 23424534</div>
                <div className={"room-popup-lastInfo"}>Последняя информация 23.06 в 23:58</div>
                <ul>
                    <li>
                        info
                    </li>
                </ul>
                <img className={"room-popup-closeBtn"} src={"/Pictures/Крестик.svg"}
                     onClick={() => setPopupIsOpen(false)}/>
            </div>

        </div>
    );
};

export default RoomFirstView;