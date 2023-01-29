import { FC, useEffect, useState } from "react"
import { StyleSheet, Button, View, Text, Image, FlatList, TextInput, ImageBackground, TouchableOpacity, SafeAreaView } from "react-native"
import { Message } from "./models/message_model"
import message_model from "./models/message_model"
import { Colors } from "react-native/Libraries/NewAppScreen"
const currUsr = "Dagi"
const getUsrAvatar = (usrId: string) => {
    return require('./assets/o.png')
}

const ChatFeed: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [msgs, setMsgs] = useState(message_model.getAllMsgs())
    const [counter, setCounter] = useState<number>(0)
    const [text, onChangeText] = useState('')
    const sendMessage = () => {
        console.log(text)
        message_model.addMessage(text,currUsr)
        onChangeText('')
    }
    useEffect(() => {
        const updateOnFocus = navigation.addListener('focus', () => {
            setMsgs(message_model.getAllMsgs())
        })
    })
    return (
        <View style={styles.mainFrame}>
            <FlatList style={styles.flatlist}
                data={msgs}
                keyExtractor={msg => msg.id}
                renderItem={({ item }) => (
                    <ChatItem from={item.from} to={item.to} msg={item.msg} id={item.id} />
                )}>
            </FlatList>
            <View style={styles.inputRow}>
            <TextInput style={styles.input}
                onChangeText={onChangeText}
                value={text}
            />
            <TouchableOpacity onPress={sendMessage}><Image source={require('./assets/o.png')} style={styles.sendButton}></Image></TouchableOpacity>
            </View>
        </View>
    );
}
export const ChatItem: FC<{ from: string, to: string, msg: string, id: string }> =
    ({ from, to, msg, id }) => {
        if (from === currUsr) // My message: outgoing
            return (
                <View style={styles.listRow} >
                    <View style={styles.myBubbleContainer}>
                        <ImageBackground source={require('./assets/outMsgBubble.png')} resizeMode='stretch' style={styles.myBubble}>
                            <Text style={styles.outMessageTxtBox} > {msg} </Text>
                        </ImageBackground>
                    </View>
                </View>
            )
        else // Other message : incoming
            return (
                <View style={styles.listRow} >
                    <View style={styles.avatarAndNameContainer}>
                        <Image source={getUsrAvatar(from)} style={styles.avatar}></Image>
                        <Text style={styles.senderNameTxtBox}> {from} </Text>
                    </View>
                    <View style={styles.bubbleContainer}>
                        <ImageBackground source={require('./assets/inMsgBubble.png')} resizeMode='stretch' style={styles.bubble}>
                            <Text style={styles.messageTxtBox} > {msg} </Text>
                        </ImageBackground>
                    </View>
                </View>
            )
    }
export default ChatFeed
const styles = StyleSheet.create({
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
    // listRowTextContainer: {
    //     flex: 1,
    //     margin: 15,
    // },

    avatar: {
        flex: 1,
        height: 100,
        aspectRatio: 1,
        justifyContent: 'center'
    },
    bubbleContainer: {
        flex: 3,
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
        flexDirection: 'column'
    },
    inputRow:{
        flexDirection: 'row',
    },
    sendButton:{
        flex: 1,
        aspectRatio: 1,
        height: 40,
        padding: 5,
        alignSelf: 'flex-end'
    },
    input: {
        flex: 10,
        height: 40,
        margin: 8,
        borderWidth: 1,
        padding: 5,
    }

})