import {useCookies} from "react-cookie";
import UserHome from "./UserHome/UserHome";
import WorkerHome from "./WorkerHome/WorkerHome";
import {useContext} from "react";
import {Context} from "../../../index";

export const Home = () => {
    const {store} = useContext(Context)
    store.setUrl(window.location.hash)
    return(
      <>
          {(store.roles.includes('Customer') || (!store.isAuth))&&<UserHome/>}
          {(store.roles.includes('Admin') && (!store.isAuth))&&<WorkerHome/>}
      </>
  )
}