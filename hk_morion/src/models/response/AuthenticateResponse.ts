import {IUser} from "../user/IUser";

export interface AuthenticateResponse {
    token:string;
    refreshtoken:string;
    roles:string[];
    user: IUser;
    status: number;
}