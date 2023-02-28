import clisentApi from './client_api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthData } from '../models/auth_model';
import clientApi from './client_api';
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
    return await clisentApi.post("/auth/logout", {}, {headers: {"Authorization": "JWT " + refreshToken}})
}
const getUser = async(id:String) => {
    const x = await clisentApi.get("/usr", {id: id}) // add auth header.
    return x // add auth header.
}
const editUser = async (id: String, data: Object, accessToken: string) => {
    return clientApi.put("/usr/" + id, { params: data }, { headers: { "Authorization": "JWT " + accessToken } })
}
export default { registerUser, loginUser, logoutUser ,getUser, editUser}