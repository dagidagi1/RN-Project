import React, { FC, useEffect, useState } from "react"
import { StyleSheet, View, Text, Image, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from "react-native"
import { Message } from "./SocketService"
import socketService from "./SocketService"
import user_model from "./models/user_model"
import Ionicons from '@expo/vector-icons/Ionicons';
import myColors from "./myColors"
import GlobalVars from "./GlobalVars"

const ChatFeed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [msgs, setMsgs] = useState<Array<Message>>([])
    const [text, setText] = useState('')
    const [newMsg, setNewMsg] = useState<boolean>(false)
    let socket = socketService.getInstance().getSocket()
    useEffect(() => {
        socketService.getInstance().requestAllMessages()
    }, [])
    useEffect(() => {
        if (newMsg)
            socketService.getInstance().requestAllMessages()
    }, [newMsg])
    const sendMessage = () => {
        if (text != '' && text.replace(/\s/g, '') != '')
            socketService.getInstance().sendMessage(text)
        setText('')
    }
    useEffect(() => {
        socket.on("chat:message", (args: any) => {
            const msg: Message = {
                from: args.from,
                id: args.id,
                msg: args.message,
                to: args.to,
                time: args.time
            }
            setNewMsg(true)
        })
        socket.on("chat:get_messages.response", (args: any) => {
            let data: Array<Message> = []
            if (args) {
                args.forEach((e: any) => {
                    const msg: Message = {
                        from: e.from,
                        id: e._id,
                        msg: e.message,
                        to: e.to,
                        time: e.time
                    }
                    data.push(msg)
                })
                setMsgs(data.reverse())
                setNewMsg(false)
            }
        })
    }, [socket])
    return (
        <View style={styles.mainFrame}>
            <FlatList style={styles.flatlist}
                inverted
                data={msgs}
                keyExtractor={msg => msg.id}
                renderItem={({ item }) => (
                    <ChatItem from={item.from} to={item.to} msg={item.msg} id={item.id} time={item.time} />
                )}>
            </FlatList>
            <View style={styles.inputRow}>
                <TextInput style={styles.input}
                    onChangeText={setText}
                    value={text}
                    multiline={true}
                />
                <TouchableOpacity onPress={sendMessage}><Ionicons name="paper-plane" size={40} color={myColors.tabIcon} style={{ marginTop: 6, marginEnd: 8 }} /></TouchableOpacity>
            </View>
        </View>
    );
}
export const ChatItem: FC<{ from: string, to: string, msg: string, id: string, time: string }> =
    ({ from, to, msg, id, time }) => {
        const [usrUri, setUsrUri] = useState(GlobalVars.defaultAvatar)
        const [loading, setLoading] = useState(true)
        const [usrName, setUsrName] = useState('')
        const func = async () => {
            const x = await user_model.getUser(from)
            setUsrUri(x.img.toString())
            setUsrName(x.name.toString())
            setLoading(false)
        }
        useEffect(() => {
            func()
        }, [])
        const convertTime = (t: string) => {
            return getHoursAndMinutes(new Date(Number(time)))
        }
        function getHoursAndMinutes(date: Date) {
            return (
                padTo2Digits(date.getHours()) + ":" + padTo2Digits(date.getMinutes())
            );
        }

        function padTo2Digits(num: Number) {
            return String(num).padStart(2, "0");
        }
        if (socketService.getInstance().isItMe(from))
            return (
                <View style={styles.myContainer}>
                    <View style={styles.myMessageBox}>
                        <Text style={styles.myText}>{msg}</Text>
                        <Text style={styles.myTime}>
                            {convertTime(time)}
                        </Text>
                    </View>
                </View>
            )
        return (
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator animating={true} size="large" />
                ) : (
                    <Image source={{ uri: usrUri }} style={styles.avatar} />
                )}
                <View style={styles.messageBox}>
                    <Text style={styles.myName}>{usrName}</Text>
                    <Text style={styles.text}>{msg}</Text>
                    <Text style={styles.time}>
                        {convertTime(time)}
                    </Text>
                </View>
            </View>
        );
    };
export default ChatFeed
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 10,
    },
    myContainer: {
        flexDirection: "row",
        marginBottom: 10,
        alignSelf: 'flex-end',
        marginEnd: 10
    },
    title: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
    },
    avatar: {
        margin: 8,
        width: 38,
        aspectRatio: 1,
        borderRadius: 15,
    },
    time: {
        color: 'black',
        position: "absolute",
        bottom: 1,
        right: 10,
        fontSize: 10,
    },
    myTime: {
        color: 'gray',
        position: "absolute",
        bottom: 1,
        right: 10,
        fontSize: 10,
    },
    myMessageBox: {
        width: "70%",
        borderRadius: 15,
        backgroundColor: myColors.myMessage,
    },
    messageBox: {
        width: "70%",
        borderRadius: 15,
        backgroundColor: myColors.message,
        flexDirection: 'column'
    },
    text: {
        margin: 10,
        color: myColors.msgText,
        marginBottom: 8,
    },
    myName: {
        alignSelf:'center',
        fontWeight: 'bold',
        textShadowRadius: 10,
        color: myColors.msgText,
    },
    myText: {
        margin: 10,
        color: myColors.msgText,
        marginBottom: 8,
    },


    listRow: {
        flex: 1,
        margin: 2,
        flexDirection: "row",
    },
    flatlist: {
        flex: 1,
        marginTop: 35
    },
    messageTxtBox: {
        flex: 1,
        fontSize: 22,
        textAlign: 'center',
        marginLeft: 35,
        marginTop: 10,
    },
    outMessageTxtBox: {
        flex: 1,
        fontSize: 22,
        textAlign: 'center',
        marginRight: 35,
        marginTop: 10,
    },
    aavatar: {
        flex: 1,
        height: 100,
        aspectRatio: 1,
        justifyContent: 'center'
    },
    bubbleContainer: {
        flex: 2,
        alignSelf: 'flex-start'
    },
    myBubbleContainer: {
        flex: 1,
        alignSelf: 'flex-end',
    },
    bubble: {
        flex: 2,
        flexWrap: "wrap",
        marginTop: 15,
        marginEnd: 5,
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },
    myBubble: {
        flex: 2,
        flexWrap: "wrap",
        marginTop: 15,
        marginEnd: 5,
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
    senderNameTxtBox: {
        fontSize: 20,
        flex: 1,
        flexDirection: 'row',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    avatarAndNameContainer: {
        marginLeft: 5,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    mainFrame: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: myColors.mainBackground
    },
    inputRow: {
        flexDirection: 'row',
    },
    input: {
        flex: 10,
        height: 38,
        margin: 8,
        borderWidth: 1,
        padding: 5,
        borderColor: myColors.tabIcon
    }

})