import './UserLayout.css'
import {SpaRoutes} from "../../../../Routes/spaRoutes";
import {Context} from "../../../../index";
import React, {useContext, useEffect} from "react";
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";

const UserLayout = () => {
    const {store} = useContext(Context)
    let currentUrl = window.location.hash;

   return(
      <>
          <div className={"userLayout-header"}>
              <div>
                  <div className={"userLayout-title"}>{store.title}</div>
                  <div className={"userLayout-subTitle"}>ул 50 лет Октября</div>
              </div>
              <Link className={'home-img'} to={SpaRoutes.HOME}><img src={'/Pictures/home-icon.svg'}/></Link>

          </div>

      </>
  )
}
export default observer (UserLayout)