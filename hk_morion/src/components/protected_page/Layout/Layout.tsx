import {useCookies} from "react-cookie";
import {useContext} from "react";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import UserLayout from "./UserLayout/UserLayout";
import {SpaRoutes} from "../../../Routes/spaRoutes";

const Layout = () => {
    const {store} = useContext(Context)
    return(
        <>
            {(store.roles.includes('Customer')
                &&store.url.indexOf(SpaRoutes.LOGIN)===-1
                &&store.url.length>2
            ) && <UserLayout/>}
            {/*{(cookie?.hk_morion?.role === 'Worker' && cookie?.hk_morion?.isAuth)&&<WorkerHome/>}*/}
        </>
    )
}
export default observer (Layout)