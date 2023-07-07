import React from 'react';
import "./WorkerHome.css"
const WorkerHome = () => {
    return (
        <div className={"workerHome-mainContainer"}>
            <div className={"workerHome-crash"}>
                Аварии
                <div>
                    1
                    <img src={"/Pictures/redCircle.svg"}/>
                </div>
            </div>
            <div className={"workerHome-request"}>
                Заявки
                <div>
                    1
                    <img src={"/Pictures/redCircle.svg"}/>
                </div>
            </div>
        </div>
    );
};

export default WorkerHome;