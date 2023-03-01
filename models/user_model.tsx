import userApi from "../api/user_api";
import FormData from "form-data";
import clientApi from "../api/client_api";
import { AuthData, auth_model } from "./auth_model";
import GlobalVars from "../GlobalVars";
import { ToastAndroid } from "react-native";
export type User = {
  name: String,
  email: String,
  img: String,
  id: String,
  phone: String,
}

let authData: AuthData
const getSelf = async () => {
  if (!authData) authData = await auth_model.getInstance().getAuthData()
  return await getUser(authData.id)
}
const getUser = async (id: String) => {
  if (!authData) authData = await auth_model.getInstance().getAuthData()
  const res: any = await userApi.getUser(id, authData.accToken);
  let user: User = {name: 'Not found', email: '', img: '', id: '', phone: ''}
  if (res.status == 200) {
    try {
      const usr = res.data.data
      user = {
        name: usr.name,
        email: usr.email,
        img: usr.img,
        id: usr.id,
        phone: usr.phone
      }
    } catch (err) {
      console.log("(ERROR STATUS: "+ res.status + ") - user model -> getUser : ", err)
    }
  }
  return user;
};

const uploadImage = async (imageURI: String) => {
  var body = new FormData();
  body.append("file", { name: "name", type: "image/jpeg", uri: imageURI });
  let url = "/file/";
  const res: any = await clientApi.post(url, body);
  if (!res.ok) {
    ToastAndroid.show("Upload image failed!",ToastAndroid.LONG)
    return GlobalVars.defaultAvatar
  }
    return res.data.url
}

const editUser = async (data: Object) => {
  if (!authData) authData = await auth_model.getInstance().getAuthData()
  const res = await userApi.editUser(authData.id, data, authData.accToken)
  console.log("EDIT ERR: ", res.status)
  if (res.status == 200) return true
  return false
}

export default { getUser, uploadImage, editUser, getSelf };