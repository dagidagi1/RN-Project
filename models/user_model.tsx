import userApi from "../api/user_api";
import FormData from "form-data";
import clientApi from "../api/client_api";
export type User = {
  name: String,
  email: String,
  img: String,
  id: String
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
      id: usr.id
    }
  }
  else{
    user = {
      name: 'Not found',
      email: '',
      img: '',
      id: ''
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
export default { getUser, uploadImage };