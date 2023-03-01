import post_api from '../api/post_api';
import PostApi from '../api/post_api';
import { AuthData, auth_model } from './auth_model';
export type Post = {
    id: string,
    txt: string,
    usrId: string,
    img: string
}
export class post_model {
    private static myInstance: post_model = new post_model()
    private authData: AuthData = auth_model.getInstance().getAuthData()
    private MyPostsSetter: (f: boolean) => void = (f) => { }
    private flag: boolean = false
    public press = () => {
        this.flag = !this.flag
        this.MyPostsSetter(this.flag)
        return this.flag
    }
    static getInstance() {
        return this.myInstance;
    }
    constructor() { }
    public getMySetter = () => {
        return this.MyPostsSetter
    }
    public setMyPostSetter = (f: (f: boolean) => void) => {
        this.MyPostsSetter = f
    }
    public addPost = async (imgUri: string, txt: string) => {
        const post = {
            id: '',
            txt: txt,
            usrId: this.authData.id,
            img: imgUri
        }
        const res: any = await PostApi.addPost(post, this.authData.accToken)
        if (res.status == 200) {
            return true
        }
        else
            console.log("STATUS: " + JSON.stringify(res))
        return false
    }
    public getPosts = async () => {
        if (this.authData.status == 999) {
            await auth_model.getInstance().updateData()
            this.authData = auth_model.getInstance().getAuthData()
        }
        if (this.authData.status == 200) {
            if (this.flag) return await this.getMyPosts()
            return await this.getAllPosts()
        }
        return []
    }
    private getAllPosts = async () => {
        let posts: Array<Post> = []
        const res: any = await PostApi.getAllPosts(this.authData.accToken)
        if (res.status == 200) {
            res.data.data.forEach((element: any) => {
                const p: Post = {
                    id: element._id,
                    img: element.imgUri,
                    txt: element.txt,
                    usrId: element.usrId
                }
                posts.push(p)
            })
        }
        return posts.reverse()
    }
    private getMyPosts = async () => {
        const allPosts: Array<Post> = await this.getAllPosts()
        return allPosts.filter(post => post.usrId == this.authData.id)
    }
    public editPost = async (postId: String, txt: String, imgUri: String) => {
        let data = { 'id': postId }
        if (txt != '') Object.assign(data, { 'txt': txt })
        if (imgUri != '') Object.assign(data, { 'imgUri': imgUri })
        const res = await post_api.editPost(postId, data, this.authData.accToken)
        if (res.status == 200)
            return true
        return false
    }
    public deletePost = async(postId: String)=>{
        const res = await post_api.deletePostById(postId,this.authData.accToken)
        return (res.status == 200)
    }
}