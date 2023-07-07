import React, {useEffect, useState} from "react";
import {IDevice} from "../../../models/response/HomeResponse";
import HomeService from "../../../services/HomeService";
import {IDimInfo, ITermInfo} from "../../../models/request/HomeRequest";

interface Interface {
    handler:(bol:boolean)=>void;
    isOpen:boolean;
    data?:IDevice;
}

export const PopupRoom = ({handler, isOpen, data}:Interface) => {
    const [term,setTerm]=useState<ITermInfo>()
    const [dim,setDim]=useState<IDimInfo>()

    useEffect(()=>{
        if(data?.type==='term')
            HomeService.Termostat(data.id)
                .then((resp)=>{
                    if(resp.status===200)
                        setTerm(resp.data)
                })
        if(data?.type==='lamp_a1')
            HomeService.Dimmer(data.id)
                .then((resp)=>{
                    if(resp.status===200)
                        setDim(resp.data)
                })
    },[data])

    const handlerLampClick=()=>{
        if(data?.id)
            if(dim?.isOn)
                HomeService.DimmerOff(data?.id)
                    .then(()=>{setDim({isOn:false})})
            else
                HomeService.DimmerOn(data?.id)
                    .then(()=>{setDim({isOn:true})})
    }

  return(
      <div className={"room-popup"} data-isOpen={isOpen}>
          <div className={"room-popup-title"}>{data?.name}</div>
          <div className={"room-popup-id"}>id {data?.id}</div>
          <img className={"room-popup-closeBtn"} src={"/Pictures/Крестик.svg"}
               onClick={() => handler(false)}
          />
          {data?.type === 'term'&&
              <>
                  <div>Показания CO2 {term?.co2}</div>
                  <div>Минимальная температура {term?.minTemperature}</div>
                  <div>Абсолютная температура {term?.temperature}</div>
                  <div>Влажность {term?.moisture}</div>
                  <div>Давление {term?.pressure}</div>
              </>
          }
          {data?.type === 'lamp_a1'&&
              <>
                  <button onClick={handlerLampClick}>{dim?.isOn?"Включить":"Выключить"}</button>
              </>
          }
      </div>
  )
}