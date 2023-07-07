import React, {useContext, useState} from 'react';
import "./Room.css"
import RoomSecondView from "./RoomSecondView";
import RoomFirstView from "./RoomFirstView";
import {Context} from "../../../index";
const Room = () => {
    const {store} = useContext(Context)

    store.setUrl(window.location.hash)
    store.setTitle('Помещение')

    const [isRoom, setIsRoom] = useState(false);
    return (
        <div className="room-mainContainer">
            <div onClick={() => setIsRoom(!isRoom)}
                 className={"room-button"}
                 style={{backgroundColor: isRoom? "white" : "black"}}>
                <img src={isRoom? "/Pictures/iconList.svg" : "/Pictures/iconRoom.svg"}/>
            </div>
            <div className={"room-search"}>
                <input type={"search"} placeholder={"Найти..."}/>
                <img src={"/Pictures/roomSearch.svg"}/>
            </div>

            <div className={"room-sliderSelect-container"}>
                <div className={"room-sliderItems"}>
                    <div className={"room-sliderItem"}>Весь дом</div>
                    <div className={"room-sliderItem"}>Спальня</div>
                    <div className={"room-sliderItem"}>Кухня</div>
                    <div className={"room-sliderItem"}>Прихожая</div>
                    <div className={"room-sliderItem"}>Прихожая</div>
                    <div className={"room-sliderItem"}>Прихожая</div>
                    <div className={"room-sliderItem"}>Прихожая</div>
                </div>

                <img className={"room-sliderListRooms"} src={"/Pictures/iconListRooms.svg"}/>
            </div>

            {isRoom? <RoomSecondView/> : <RoomFirstView/>}

        </div>
    );
};

export default Room;