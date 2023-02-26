import clisentApi from './client_api';

const registerUser = async(userJson: any) => {
    return clisentApi.post("/auth/register", userJson)
}

const loginUser = async(authJson: any) => {
    return clisentApi.post("/auth/login", authJson)
}

const logoutUser = async(refreshToken: any) => {
    return await clisentApi.get("/auth/logout", {}, {headers: {"Authorization": "JWT " + refreshToken}})
}

export default { registerUser, loginUser, logoutUser }