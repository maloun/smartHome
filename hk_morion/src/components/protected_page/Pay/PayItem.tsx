import './Pay.css'
import {Ru} from "../../../functions/functions";

interface PayItemInterface {
    title:string;
    amount:number;
}

export const PayItem = ({title, amount}: PayItemInterface) => {
  return(
      <div className={'pay-item'}>
          <img className={'arrow-img'} src={'/Pictures/white-arrow-down.svg'}/>
          {title}
          <div>{Ru(amount)}</div>
      </div>
  )
}