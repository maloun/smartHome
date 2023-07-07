import React from 'react';

const RoomSecondView = () => {
    const clickDevice = (a:any) => {

    }
    return (
        <div className={"room-mapContainer"}>
            <div className={"room-map"}>
                <img src={"/Pictures/roomMap.svg"}/>
                <div className={"room-map-devices"}>
                    <div  className={"room-map-device"} >
                        <img src={"/Pictures/iconDeviceNoActive.svg"}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomSecondView;