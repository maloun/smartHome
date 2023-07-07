import { useLocation, Navigate, Outlet } from "react-router-dom";
import {useContext} from "react";
import {observer} from "mobx-react-lite";
import './../../index.css';
import {SpaRoutes} from "../../Routes/spaRoutes";
import {Context} from "../../index";

const RequireAuth = ({ allowedRoles }:any) => {
    const {store} = useContext(Context)
    const location = useLocation();

    return (
        store.isLoading?<div className={"loading"}>Загрузка...</div>:

            store?.roles?.find((role) => allowedRoles?.includes(role))
                ? <Outlet />
                : store?.isAuth
                    ? <Navigate to={SpaRoutes.UNAUTHORIZED} state={{ from: location }} replace />
                    :<Navigate to={SpaRoutes.LOGIN} state={{from: location}} replace/>
    );
}

export default observer(RequireAuth);