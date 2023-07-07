import {AxiosResponse} from "axios";
import {AuthenticateResponse} from "../models/response/AuthenticateResponse";
import $api from "../axios/axios";
import {IndexResponse} from "../models/response/HomeResponse";
const {ApiRoutes: { Home }} = require("../Routes/apiRoutes");

export default class HomeService {
    static async index():Promise<AxiosResponse<IndexResponse>>{
        return $api.get(Home.INDEX)
    }
}