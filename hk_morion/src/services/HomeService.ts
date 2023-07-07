import {AxiosResponse} from "axios";
import {AuthenticateResponse} from "../models/response/AuthenticateResponse";
import $api from "../axios/axios";
import {IDevice, IndexResponse} from "../models/response/HomeResponse";
import {IDimInfo, ITermInfo} from "../models/request/HomeRequest";
const {ApiRoutes: { Home }} = require("../Routes/apiRoutes");

export default class HomeService {
    static async index():Promise<AxiosResponse<IndexResponse>>{
        return $api.get(Home.INDEX)
    }
    static async devices():Promise<AxiosResponse<IDevice[]>>{
        return $api.get(Home.DEVICES)
    }
    static async Dimmer(id:string):Promise<AxiosResponse<IDimInfo>>{
        return $api.post(Home.DIMMER,{device:id})
    }
    static async DimmerOn(id:string):Promise<AxiosResponse>{
        return $api.post(Home.DIMMERON,{device:id})
    }
    static async DimmerOff(id:string):Promise<AxiosResponse>{
        return $api.post(Home.DIMMEROFF,{device:id})
    }
    static async Termostat(id:string):Promise<AxiosResponse<ITermInfo>>{
        return $api.post(Home.TERMOSTAT,{device:id})
    }
}