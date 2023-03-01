import AsyncStorage from '@react-native-async-storage/async-storage';
import Client from 'socket.io-client'
import GlobalVars from './GlobalVars';
import { AuthData } from './models/auth_model'
export type Message = {
    from: string,
    to: string,
    msg: string,
    id: string    
}
export default class MySocket {
    private static myInstance: any = null
    public mySocket: any
    private authData: AuthData = { refToken: 'NO-DATA', accToken: 'NO-DATA', id: 'NO-DATA', status: 999 }

    static getInstance() {
        if (MySocket.myInstance == null) MySocket.myInstance = new MySocket();
        return this.myInstance;
    }
    constructor() {
    }
    public createSocket = async () => {
        try {
            const authDataSerialized = await AsyncStorage.getItem('@AuthData');
            if (authDataSerialized)
                this.authData = JSON.parse(authDataSerialized);
            else
                console.log('async storage @AuthData is undifined! ')
        } catch (error) {
            console.log("Error loading data from memory")
        }
        this.mySocket = Client(GlobalVars.serverIP, {
            auth: { token: 'barrer ' + this.authData.accToken }
        })
        await this.clientSocketConnect()
        this.mySocket
    }
    public requestAllMessages = ()=>{
        this.mySocket.emit("chat:get_messages", {})
    }
    private clientSocketConnect = (): Promise<string> => {
        return new Promise((resolve) => {
            this.mySocket.on('connect', () => {
                console.log('connected to socket')
                resolve('1')
            })
        })
    }
    public sendMessage = (msg: any) => {
        this.mySocket.emit("chat:send_message", { "to": 'global', "message": msg })
    }
    public isItMe = (id:string)=>{
        return id == this.authData.id
    }
    public getSocket() {
        return this.mySocket;
    }
}
