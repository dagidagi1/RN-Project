import clisentApi from './client_api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthData } from '../models/auth_model';
const getAuthData = async ()=>{
    try {
        const authDataSerialized = await AsyncStorage.getItem('@AuthData');
        if (authDataSerialized) {
            const data = JSON.parse(authDataSerialized);
            return data
        }
        else
            return null
    } catch (error) {
        return null
    }
}
let authData:AuthData
const registerUser = async(userJson: any) => {
    return clisentApi.post("/auth/register", userJson)
}

const loginUser = async(authJson: any) => {
    return clisentApi.post("/auth/login", authJson)
}

const logoutUser = async(refreshToken: any) => {
    return await clisentApi.get("/auth/logout", {}, {headers: {"Authorization": "JWT " + refreshToken}})
}
const getUser = async(id:String) => {
    //authData = await getAuthData()
    const x = await clisentApi.get("/usr", {id: id}) // add auth header.
    return x // add auth header.
}
export default { registerUser, loginUser, logoutUser ,getUser}