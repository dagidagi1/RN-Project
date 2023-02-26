export type Post = {
    id: string,
    txt: string,
    usrId: string,
    img: string
}
var posts: Array<Post> = [
    {
        id: 'post1',
        txt: 'hello\nBratan',
        usrId: 'string',
        img: './assets/o.png'    
    },
    {
        id: 'post2',
        txt: 'string',
        usrId: 'string',
        img: './assets/o.png'    
    },
    {
        id: 'post3',
        txt: 'string',
        usrId: 'string',
        img: './assets/o.png'    
    },
    {
        id: 'post4',
        txt: 'string',
        usrId: 'string',
        img: './assets/usr_icon.png'    
    },
]
const getAllPosts = () => {
    return posts
}
const addPost = (newPost:Post) =>{
    posts.push(newPost)
}
const getPostById = (id:string) => {
    let pst:Post = {id: '', txt: '', usrId: '', img: ''}
    posts.forEach((i) =>{
        if(i.id === id) pst = i
    })
    return pst
}
export default {getAllPosts, addPost, getPostById}