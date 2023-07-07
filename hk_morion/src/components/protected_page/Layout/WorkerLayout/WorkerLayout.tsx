import React from 'react';
import "./WorkerLayout.css"
const WorkerLayout = () => {
    return (
        <div className={"worker-layout"}>
            <div>
                <div>Диспетчер:</div>
                <div>Иванов Иван Иванович</div>
            </div>
            <div>
                <div className={"worker-companyName"}>
                    OOO "ТСЖ"
                </div>
                <div className={"worker-city"}>
                    Пермь
                </div>
            </div>
            <div className={"worker-address"}>
                <div>
                    Район: Индустриальный
                </div>
                <div>
                    Адрес: ул. Шоссе Космонавтов, д. 111д
                </div>
            </div>
        </div>
    );
};

export default WorkerLayout;