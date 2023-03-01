import { Post } from "../models/post_model";
import ClientApi from "./client_api";

const getAllPosts = async (accessToken: string) => {
    return await ClientApi.get("/post/", {}, { headers: { "Authorization": "JWT " + accessToken } })
}
const addPost = async (post: Post, accessToken: any) => {
    const newPost = {
        txt: post.txt,
        usrId: post.usrId,
        img: post.img
    }
    return ClientApi.post("/post", newPost, { headers: { "Authorization": "JWT " + accessToken } })
}
const deletePostById = async (id: String, accessToken: string) => {
    return ClientApi.post("/post/delete/" + id, { params: { id: id } }, { headers: { "Authorization": "JWT " + accessToken } })
}
const editPost = async (id: String, data: Object, accessToken: string) => {
    return ClientApi.put("/post/" + id, { params: data }, { headers: { "Authorization": "JWT " + accessToken } })
}

export default { getAllPosts, addPost, deletePostById, editPost }