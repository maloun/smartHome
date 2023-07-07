import {makeObservable, observable} from "mobx";
import AuthenticateService from "../services/AuthenticateService";
import {IUser} from "../models/user/IUser";

export default class Store {
    user = {} as IUser;
    @observable isAuth = false;
    @observable isLoading = true;
    @observable roles: string[] = [];
    @observable CartItemsNumber = 0;
    @observable isHubOn = false;
    @observable Logout = false;
    @observable url = '';
    @observable title = '';

    constructor() {
        makeObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    setRoles(rols: string[]) {
        this.roles = rols;
    }

    setLogout(bool: boolean) {
        this.Logout = bool;
    }
    setUrl(url: string) {
        this.url = url;
    }
    setTitle(title: string) {
        this.title = title;
    }

    async login(email: string, password: string) {
        try {
            this.setLogout(false)
            const response = await AuthenticateService.login(email, password)
            localStorage.setItem('token', response.data.token)
            this.setAuth(true)
            // localStorage.setItem('userId', response.data.user.id)
            this.setRoles(response.data.roles)
            this.setUser(response.data.user)
            return response.status
        } catch (e: any) {
            console.log(e.response)
            return e.response.status
        } finally {
            this.setLoading(false)
        }
    }

    async logout() {
        try {
            this.setLogout(true)
            localStorage.removeItem('token');
            localStorage.removeItem('userId')
            this.setAuth(false)
            this.setRoles([])
            this.setUser({} as IUser)
            this.setAuth(false)
        } catch (e: any) {
            console.log(e.response)
        }
    }

    async checkAuth() {
        if (!this.Logout) {
            try {
                this.setLogout(false)
                const response = await AuthenticateService.refreshToken(true)
                localStorage.setItem('token', response.data.token)
                this.setAuth(true)
                this.setRoles(response.data.roles)
                this.setUser(response.data.user)
            } catch (e: any) {
                console.log(e.response)
            } finally {
                this.setLoading(false)
            }
        }
    }
}