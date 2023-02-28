import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native';
import user_api from '../api/user_api';
export type AuthData = {
    refToken: string;
    accToken: string;
    id: string;
    status: number
}
let data: AuthData
const loadStorageData = async () => {
    try {
        const authDataSerialized = await AsyncStorage.getItem('@AuthData');
        if (authDataSerialized) {
            data = JSON.parse(authDataSerialized);
            loggedSetter(true)
        }
        else
            console.log('async storage @AuthData is undifined! ')
    } catch (error) {
        console.log("Error loading data from memory")
    }
}
let loggedSetter: (f: any) => void = (f) => { }
const login = async (username: string, password: string) => {
    const userData = {
        email: username,
        password: password,
    }
    const res: any = await user_api.loginUser(userData)
    if (res.status == 200) {
        data = {
            accToken: res.data.accessToken,
            refToken: res.data.refreshToken,
            id: res.data.id,
            status: res.status,
        }
        await AsyncStorage.setItem('@AuthData', JSON.stringify(data));
        loggedSetter(true)
        return '-1'
    }
    else
        return res.data.message
}
export const setloggedSetter = (f: any) => {
    loggedSetter = f
}
export const getloggedSetterSetter = () => {
    return loggedSetter
}
const logout = async () => {
    // const res: any = await UserAPI.logoutUser(refreshToken)
    // console.log(res)
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //       resolve({
    //         accessToken: "",
    //         refreshToken: "",
    //         id: "",
    //         status: res.status,
    //         error: res.data?.error
    //       });
    //     }, 1000);
    //   });
    await loadStorageData()
    const res = await user_api.logoutUser(data.refToken)
    if (res.status != 200)
        ToastAndroid.show("LOGOUT: server error: "+ res.status, ToastAndroid.LONG)
    await AsyncStorage.removeItem('@AuthData')
    loggedSetter(false)
};
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const init = async (setter: (f: boolean) => void) => {
    loggedSetter = setter
    loadStorageData()
    return true
}

export const auth_model = { init, login, logout }