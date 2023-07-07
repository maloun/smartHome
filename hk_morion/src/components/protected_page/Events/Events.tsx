import {useContext} from "react";
import {Context} from "../../../index";

export const Events = () => {
    const {store} = useContext(Context)

    store.setUrl(window.location.hash)
    store.setTitle('События')
  return(
      <>

      </>
  )
}