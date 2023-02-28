import userApi from "../api/user_api";
import FormData from "form-data";
import clientApi from "../api/client_api";
import { AuthData } from "./auth_model";
import AsyncStorage from "@react-native-async-storage/async-storage";
export type User = {
  name: String,
  email: String,
  img: String,
  id: String,
  phone: String,
}

let authData: AuthData 
const loadStorageData = async () => {
  try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
          authData = JSON.parse(authDataSerialized);
          return JSON.parse(authDataSerialized);
      }
      else
          console.log('async storage @AuthData is undifined! ')
  } catch (error) {
      console.log("Error loading data from memory")
  }
  return null
}
const getSelf = async () =>{
  await loadStorageData()
  return await getUser(authData.id)
}
const getUser = async (id: String) => {
  const res: any = await userApi.getUser(id);
  let user: User
  if (res.status == 200) {
    const usr = res.data.data
    user = {
      name: usr.name,
      email: usr.email,
      img: usr.img,
      id: usr.id,
      phone: usr.phone
    }
  }
  else{
    user = {
      name: 'Not found',
      email: '',
      img: '',
      id: '',
      phone: ''
    }
  }
  return user;
};

const uploadImage = async (imageURI: String) => {
  var body = new FormData();
  body.append("file", { name: "name", type: "image/jpeg", uri: imageURI });
  let url = "/file/";
  const res: any = await clientApi.post(url, body);
  console.log("UPLOAD STATUS: ", res.ok)
  if (!res.ok) {
    return ""
  } else {
    return res.data.url
  }
};
const editUser = async (data:Object) => {
  await loadStorageData()
  const res = await userApi.editUser(authData.id,data,authData.accToken)
  console.log("EDIT ERR: ", res.status)
    if (res.status == 200){
      return true
    }
    return false
}
export default { getUser, uploadImage,editUser,getSelf };