import React from 'react';
import './App.css';
import Login from "./components/public_page/Login/Login";
import {Route, Routes} from "react-router-dom";
import {SpaRoutes} from "./Routes/spaRoutes";
import {Home} from "./components/protected_page/Home/Home";
import Room from './components/protected_page/Room/Room';
import RequireAuth from './components/Auth/RequireAuth';
import {Pay} from "./components/protected_page/Pay/Pay";
import {Services} from "./components/protected_page/Services/Services";
import {Events} from "./components/protected_page/Events/Events";
import WorkerHome from "./components/protected_page/Home/WorkerHome/WorkerHome";

const ROLES = {
    User: 'Customer',
    Admin: 'Admin',
}

function App() {
  return (
      <Routes>

              {/* public routes */}
          <Route path={SpaRoutes.LOGIN} element={<Login />}/>

              {/* public routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path={SpaRoutes.ROOM} element={<Room />}/>
              <Route path={SpaRoutes.PAY} element={<Pay/>}/>
              <Route path={SpaRoutes.SERVICES} element={<Services/>}/>
              <Route path={SpaRoutes.EVENTS} element={<Events/>}/>
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}>
              <Route path={SpaRoutes.HOME} element={<Home/>}/>
          </Route>


      </Routes>
  );
}

export default App;
