import './Pay.css'
import {PayItem} from "./PayItem";
import {useContext} from "react";
import {Context} from "../../../index";

export const Pay = () => {
    const {store} = useContext(Context)

    store.setUrl(window.location.hash)
    store.setTitle('Платежи')
  return(
      <div className={'pay-div'}>
          <div className={'pay-header-text'}>Июль 2023</div>
          <PayItem title={'Содержание и ремонт'} amount={3640}/>
          <PayItem title={'Содержание и ремонт'} amount={3640}/>
          <PayItem title={'Содержание и ремонт'} amount={3640}/>
      </div>
  )
}