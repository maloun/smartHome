import './Services.css'
import {ServiceWorkItem} from "./ServiceWorkItem";
import {useContext} from "react";
import {Context} from "../../../index";

export const Services = () => {
    const {store} = useContext(Context)

    store.setUrl(window.location.hash)
    store.setTitle('Сервисы')
  return(
      <div className={'services-div'}>
          <div className={'services-title'}>Услуги</div>
          <div className={'services-swiper'}>
              <ServiceWorkItem title={'Электро- монтажные работы'}/>
              <ServiceWorkItem title={'Электро- монтажные работы'}/>
              <ServiceWorkItem title={'Электро- монтажные работы'}/>
              <ServiceWorkItem title={'Электро- монтажные работы'}/>
          </div>
          <div className={'services-title'}>Подрядчики</div>
          <div className={'services-swiper'}>
              <img src={'/Pictures/Service-company.png'}/>
              <img src={'/Pictures/Service-company.png'}/>
              <img src={'/Pictures/Service-company.png'}/>
          </div>
      </div>
  )
}