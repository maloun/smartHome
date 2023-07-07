import {AxiosResponse} from "axios";
import $api from "../axios/axios";
import {AuthenticateResponse} from "../models/response/AuthenticateResponse";
const {ApiRoutes: { Authenticate }} = require("../Routes/apiRoutes");


export default class AuthenticateService {
    //Login function
    static async login(email:string, password:string):Promise<AxiosResponse<AuthenticateResponse>>{
        return $api.post<AuthenticateResponse>(Authenticate.LOGIN, {email, password})
    }
    //Logout
    static async logout():Promise<void>{
        return $api.post(Authenticate.LOGOUT)
    }
    //Refresh
    static async refreshToken(_withCredentials: boolean):Promise<AxiosResponse>{
        return await $api.get<AuthenticateResponse>(Authenticate.REFRESH_TOKEN,
            {withCredentials:_withCredentials})
    }

}