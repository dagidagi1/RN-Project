import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native';
import user_api from '../api/user_api';
import MySocket from '../SocketService';
export type AuthData = {
    refToken: string;
    accToken: string;
    id: string;
    status: number
}
export class auth_model {
    private static myInstance: auth_model = new auth_model()
    private data: AuthData = { refToken: 'NO-DATA', accToken: 'NO-DATA', id: 'NO-DATA', status: 999 }
    private loggedSetter: (f: any) => void = (f) => { }

    static getInstance() {
        return this.myInstance;
    }
    constructor() { }
    public getAuthData = () => {
        return this.data
    }
    private getStorageData = async () => {
        let data: AuthData = this.data
        try {
            const authDataSerialized = await AsyncStorage.getItem('@AuthData')
            if (authDataSerialized) {
                data = JSON.parse(authDataSerialized)
                this.loggedSetter(true)
            }
            else
                console.log('Local Storage no data!!! ')
        } catch (error) {
            console.log("Error loading data from memory")
        }
        return data
    }
    public updateData= async () => {
        this.data = await this.getStorageData()
    }
    public login = async (username: string, password: string) => {
        const userData = {
            email: username,
            password: password,
        }
        const res: any = await user_api.loginUser(userData)
        if (res.status == 200) {
            this.data = {
                accToken: res.data.accessToken,
                refToken: res.data.refreshToken,
                id: res.data.id,
                status: res.status,
            }
            await AsyncStorage.setItem('@AuthData', JSON.stringify(this.data));
            this.loggedSetter(true)
            return '-1'
        }
            return res.data.message
    }
    public setloggedSetter = (f: any) => {
        this.loggedSetter = f
    }
    public getloggedSetterSetter = () => {
        return this.loggedSetter
    }
    public logout = async () => {
        if (!this.data) this.data = await this.getStorageData()
        const res = await user_api.logoutUser(this.data?.refToken)
        if (res.status != 200)
            ToastAndroid.show("LOGOUT: server error: " + res.status, ToastAndroid.LONG)
        await AsyncStorage.removeItem('@AuthData')
        MySocket.getInstance().getSocket().close()
        this.loggedSetter(false)
    }
    public init = async (setter: (f: boolean) => void) => {
        this.loggedSetter = setter
        this.data = await this.getStorageData()
        MySocket.getInstance()
        return true
    }

}