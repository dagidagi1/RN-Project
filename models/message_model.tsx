export type Message = {
    from: string,
    to: string,
    msg: string,
    id: string    
}
var idCounter = 11116
var msgs: Array<Message> = [
    {
        from: "Dagi",
        to: "Misha",
        msg: "Hi",
        id: "11111"
    },
    {
        from: "Dagi",
        to: "Misha",
        msg: "How are you?",
        id: "11112"
    },
    {
        from: "Misha",
        to: "Dagi",
        msg: "Fine!",
        id: "11113"
    },
    {
        from: "Misha",
        to: "Dagi",
        msg: "what are you doing?123123123\n asfdoasifdaowisawd\n 123123123\n 123123123123",
        id: "11114"
    },
    {
        from: "Dagi",
        to: "Misha",
        msg: "Nothing",
        id: "11115"
    },
]
const getAllMsgs = () => {
    return msgs
}
const addMessage = (msg:string, from:string) =>{
    const newMsg = {from: from, to: "all", msg: msg,id:idCounter.toString()}
    idCounter += 1
    msgs.push(newMsg)
}
export default {getAllMsgs, addMessage}