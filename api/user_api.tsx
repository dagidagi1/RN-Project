import clisentApi from './client_api';
import clientApi from './client_api';

const registerUser = async (userJson: any) => {
    return clisentApi.post("/auth/register", userJson)
}

const loginUser = async (authJson: any) => {
    return clisentApi.post("/auth/login", authJson)
}

const logoutUser = async (refreshToken: any) => {
    return await clisentApi.post("/auth/logout", {}, { headers: { "Authorization": "JWT " + refreshToken } })
}
const getUser = async (id: String, accessToken: string) => {
    const x = await clisentApi.get("/usr", { id: id }, { headers: { "Authorization": "JWT " + accessToken } })
    return x 
}
const editUser = async (id: String, data: Object, accessToken: string) => {
    return clientApi.put("/usr/" + id, { params: data }, { headers: { "Authorization": "JWT " + accessToken } })
}
export default { registerUser, loginUser, logoutUser, getUser, editUser }