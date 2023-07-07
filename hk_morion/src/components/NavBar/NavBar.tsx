import './NavBar.css'
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {SpaRoutes} from "../../Routes/spaRoutes";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const NavBar = () => {
    const {store} = useContext(Context)
    const [navbar, setNavbar] = useState(false)

    const clickHandler = ()=>{
        setNavbar(!navbar)
    }
    async function refresh() {
        await store.checkAuth()
    }

    useEffect(()=> {
        refresh()
    },[])

  return(
      <>
          {
              (store.url.indexOf(SpaRoutes.LOGIN)===-1)&&
              <div className={'navbar-div'}>
                  <Link onClick={clickHandler} to={SpaRoutes.SERVICES}>
                      <img src={store.url.indexOf(SpaRoutes.SERVICES)!=-1?'/Pictures/СервисTrue.svg':'/Pictures/Сервис.svg'}/>
                  </Link>
                  <Link onClick={clickHandler} to={SpaRoutes.PAY}>
                      <img src={store.url.indexOf(SpaRoutes.PAY)!=-1?'/Pictures/СчетаTrue.svg':'/Pictures/Счета.svg'}/>
                  </Link>
                  <Link onClick={clickHandler} to={SpaRoutes.ROOM}>
                      <img src={store.url.indexOf(SpaRoutes.ROOM)!=-1?'/Pictures/ПомещениеTrue.svg':'/Pictures/Помещение.svg'}/>
                  </Link>
                  <Link onClick={clickHandler} to={SpaRoutes.EVENTS}>
                      <img src={store.url.indexOf(SpaRoutes.EVENTS)!=-1?'/Pictures/СобытияTrue.svg':'/Pictures/События.svg'}/>
                  </Link>
                  <Link to={''}>
                      <img src={'/Pictures/Еще.svg'}/>
                  </Link>
              </div>
          }
      </>
  )
}
export default observer (NavBar)