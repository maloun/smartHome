import React, {useContext, useEffect, useState} from 'react';
import "./UserHome.css";
import {Context} from "../../../../index";
import HomeService from "../../../../services/HomeService";
import {IndexResponse} from "../../../../models/response/HomeResponse";
import {Link} from "react-router-dom";
import {SpaRoutes} from "../../../../Routes/spaRoutes";

const UserHome = () => {
    const {store} = useContext(Context)
    const [data, setData]=useState<IndexResponse>();

    useEffect(()=>{
        HomeService.index()
            .then((res)=>{
                if(res.status == 200)
                    setData(res.data)
            })
    },[])

    return (
        <div className="home-mainContainer">

            <div className={"home-header"}>
                <div className={"home-user"}>
                    <img
                        src={"https://kartinkin.net/pics/uploads/posts/2022-08/thumbs/1660825279_56-kartinkin-net-p-elbrus-oboi-krasivo-65.jpg"}/>
                    <div>
                        <div className={"home-userName"}>Name</div>
                        <div className={"home-userAddress"}>ул 50 лет Октября</div>
                    </div>
                    <Link style={{marginLeft:"auto"}} to={SpaRoutes.HOME}><img src={'/Pictures/home-icon.svg'}/></Link>
                </div>

                <div className={"home-search"}>
                    <img src={"/Pictures/iconSearch.svg"}/>
                    <input type={"search"}/>
                </div>

                <div className={"home-serviceButtons"}>
                    <div className={"home-serviceButton"}>
                        <div>
                            <img src={"/Pictures/iconRequest.svg"}/>
                        </div>
                        Создать<br/>
                        заявку
                    </div>
                    <div className={"home-serviceButton"}>
                        <div>
                            <img src={"/Pictures/iconQuestion.svg"}/>
                        </div>
                        Задать<br/>
                        вопрос
                    </div>
                    <div className={"home-serviceButton"} style={{marginBottom: "14px"}}>
                        <div>
                            <img src={"/Pictures/iconAccident.svg"}/>
                        </div>
                        Авария<br/>
                    </div>
                </div>
            </div>

            <div className={"home-diagram"}>
                <div className={"home-diagramText"}>
                    <div>
                        Горячая вода
                    </div>
                    <div>
                        Холодная вода
                    </div>
                    <div>
                        Электричество
                    </div>
                </div>
                <div data-p={data?.waterSpendHot?data.waterSpendHot:0} className="home-ring home-ring1 ring animate" >
                    <div data-p={data?.waterSpendCold?data.waterSpendCold:0} className="home-ring home-ring2 ring animate" >
                        <div data-p={data?.electricitySpend?data.electricitySpend:0} className="home-ring home-ring3 ring animate" >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default UserHome;
