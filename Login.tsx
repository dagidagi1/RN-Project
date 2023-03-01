import { FC, useEffect, useState, useContext } from "react"
import { Button, View, Alert, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Image, TouchableHighlight, Dimensions, ScrollView, ToastAndroid, ActivityIndicator, Modal } from "react-native"
import user_api from "./api/user_api";
import { auth_model } from './models/auth_model'
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import user_model from "./models/user_model";
import myColors from "./myColors";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import GlobalVars from "./GlobalVars";
const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}
const validatePhone = (pass: string) => {
    return String(pass).match(/^[0-9]{10}$/)
}
const validatePass = (pass: string) => {
    return String(pass).match(/^([0-9]|[a-z]|[A-Z]){7}([0-9]|[a-z]|[A-Z])+$/)
}
const Loading = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'red'
            }}>
            <ActivityIndicator animating={true} size="large" />
        </View>
    );
};
const Login: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [password, setPass] = useState<string>('')

    WebBrowser.maybeCompleteAuthSession() //close window after approve.
    const [gToken, setGToken] = useState("");
    const [gReq, gRes, gPromptAsync] = Google.useAuthRequest({
        expoClientId: GlobalVars.expoClienId
    });
    useEffect(() => {
        setLoading(false)
        if (gRes?.type === "success") {
            setGToken(gRes.authentication!.accessToken);
            onGoogleApprove()
        }
    }, [gRes, gToken]);
    const connectViaGoogle = async () => {
        setLoading(true)
        await gPromptAsync()
    }
    const onGoogleApprove = async () => {
        const usr = await getUserInfoG()
        if (gRes?.type === "success")
            navigation.navigate('Register', { 'exInfo': true, 'username': usr.given_name, 'avatarUri': usr.picture, 'email': usr.email, 'phone': usr.phone })
    }

    const getUserInfoG = async () => {
        try {
            const response = await fetch(
                GlobalVars.googleApiUrl,
                {
                    headers: { Authorization: `Bearer ${gToken}` },
                }
            )
            const user = await response.json();
            return user
        } catch (error) {
            console.log("(ERROR) GET USER INFO GOOGLE")
        }
    }
    useEffect(() => {
        if (route.params?.email)
            setEmail(route.params?.email)
        if (route.params?.pass)
            setPass(route.params?.pass)
    }, [route])
    const login = () => {
        if (password.length > 7 && validateEmail(email)) {
            setLoading(true)
            auth_model.getInstance().login(email, password).then((err) => { setLoading(false) })
        }
        else ToastAndroid.show('Invalid email or password', ToastAndroid.LONG)
    }

    const [request, response, promptAsync] = Facebook.useAuthRequest({
        clientId: GlobalVars.facebookAppId,
    });
    useEffect(() => {
        if (response && response.type === "success" && response.authentication) {
            (async () => {
                const userInfoResponse = await fetch(
                    GlobalVars.facebookReqUrl + response.authentication?.accessToken + GlobalVars.facebookReqFields
                );
                const userInfo = await userInfoResponse.json();
                navigation.navigate('Register', { 'exInfo': true, 'username': userInfo.name, 'avatarUri': userInfo.picture.data.url, 'email': userInfo.email })
            })();
        }
    }, [response]);
    const handlePressAsync = async () => {
        const result = await promptAsync();
    };
    const connectViaFacebook = () => {
        handlePressAsync()
    }
    if (loading) return Loading()
    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.container}>
                <ActivityIndicator animating={loading} size="large" />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPass}
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Login"
                        onPress={login}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Register"
                        onPress={() => {
                            navigation.navigate('Register')
                        }}
                    />
                </View>
                <View style={styles.cButtonsRow}>
                    <TouchableOpacity style={styles.avatarAndNameContainer} onPress={connectViaFacebook}>
                        <Image source={require('./assets/Facebook_icon.png')} style={styles.cIcons}></Image>
                        <Text style={styles.senderNameTxtBox}> {'Facebook'} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.avatarAndNameContainer} onPress={connectViaGoogle}>
                        <Image source={require('./assets/google_logo.png')} style={styles.cIcons}></Image>
                        <Text style={styles.senderNameTxtBox}> {'Google'} </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
export const Register: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [password, setPass] = useState<string>('')
    const [modalVisible, setModalVisible] = useState(false)
    const [imgUri, setImgUri] = useState(GlobalVars.defaultAvatar)
    const [newPhotoFlag, setNewPhotoFlag] = useState<boolean>(false)
    const [confPassword, setConfPassword] = useState<string>('')

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            askPermition()
            return unsubscribe
        }, [navigation])
    })

    useEffect(() => {
        if (route.params?.exInfo) {
            setName(route.params?.username)
            setImgUri(route.params?.avatarUri)
            setEmail(route.params?.email)
            setPhone(route.params?.phone)
            setNewPhotoFlag(false)
        }
        if (route.params?.editFlag) {
            setEditMode(true)
            setName(route.params?.username)
            setImgUri(route.params?.avatarUri)
            setEmail(route.params?.email)
            setPhone(route.params?.phone)
            setNewPhotoFlag(false)
        }
    }, [route])


    const askPermition = async () => {
        try {
            const res = await ImagePicker.requestCameraPermissionsAsync()
            if (!res.granted) {
                console.log("no permissions!")
            }
        } catch (err) {

        }
    }
    const openCamera = async () => {
        setModalVisible(false);
        try {
            const res = await ImagePicker.launchCameraAsync();
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setImgUri(uri);
                setNewPhotoFlag(true)
            }
        } catch (err) {
            console.log("Open camera failed");
        }
    }
    const openGallery = async () => {
        setModalVisible(false);
        try {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled && res.assets.length > 0) {
                const uri = res.assets[0].uri;
                setImgUri(uri);
                setNewPhotoFlag(true)
            }
        } catch (err) {
            console.log("Open gallery failed");
        }
    }
    const checkPass = () => {
        let txt = ''
        if (!validatePass(password)) txt += 'password, '
        if (password != confPassword) txt += 'passwords not match, '
        return txt
    }
    const checkInput = () => {
        let txt = ''
        let url
        if (name.length < 2) txt += 'name, '
        if (!validateEmail(email)) txt += 'email, '
        if (!editMode) txt += checkPass()
        if (!validatePhone(phone)) txt += 'phone, '
        return txt
    }
    const onEditPressed = async () => {
        setLoading(true)
        let successFlag: boolean = false
        let url = ''
        let data = { 'name': name, 'phone': phone, 'email': email }
        if (password != '' && checkPass() == '') {
            Object.assign(data, { 'password': password })
        }
        if (newPhotoFlag) {
            try {
                url = await user_model.uploadImage(imgUri)
                Object.assign(data, { 'img': url })
            }
            catch (err) {
                console.log('Failed to upload img')
            }
        }
        successFlag = await user_model.editUser(data)
        setLoading(false)
        if (successFlag) {
            ToastAndroid.show("Edited!", ToastAndroid.LONG)
        }
        else
            ToastAndroid.show("Post Edit Failed!", ToastAndroid.LONG)
        navigation.goBack()
    }
    const onRegisterPressed = async () => {
        //Check input: 
        try {
            const inputErrMessage = checkInput()
            let url = GlobalVars.defaultAvatar
            if (inputErrMessage === '') {
                setLoading(true)
                if (newPhotoFlag) { // User Image
                    url = await user_model.uploadImage(imgUri)
                }
                if (imgUri[0] == 'h')
                    url = imgUri
                const res: any = await user_api.registerUser({
                    email: email,
                    password: password,
                    phone: phone,
                    name: name,
                    img: url
                })
                setLoading(false)
                if (res.status == 200)
                    navigation.navigate('Login', { email: email, pass: password })
                else
                    ToastAndroid.show(res.data.message, ToastAndroid.LONG)
            }
            else
                ToastAndroid.show('Wrong: ' + inputErrMessage, ToastAndroid.LONG)
        }
        catch (err) {
            console.log("(ERROR): ", err)
        }
    }
    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={openGallery}
                        >
                            <Ionicons name="images" size={80} color={myColors.tabIcon} />
                            <Text style={{ color: myColors.tabIcon }}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={openCamera}
                        >
                            <Ionicons name="camera" size={80} color={myColors.tabIcon} />
                            <Text style={{ color: myColors.tabIcon }}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <ActivityIndicator animating={loading} size="large" />
                <TouchableHighlight onPress={() => setModalVisible(true)}>
                    <Image style={styles.avatar} source={{ uri: imgUri }}></Image>
                </TouchableHighlight>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPass}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    secureTextEntry={true}
                    value={confPassword}
                    onChangeText={setConfPassword}
                />
                <View style={styles.buttonContainer}>
                    {editMode ? (
                        <Button title="Edit" onPress={onEditPressed} />
                    ) : (
                        <Button title="Register" onPress={onRegisterPressed} />
                    )}
                    <Button title="Back" onPress={navigation.goBack} />
                </View>
            </View>
        </ScrollView>
    );
}
export default Login
const dimensions = Dimensions.get('window');
const styles = StyleSheet.create({
    cButtonsRow: {
        flex: 1,
        flexDirection: 'row',
        margin: 15,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        textAlign: 'center',
        borderColor: myColors.tabIcon
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    mainContainer: {
        backgroundColor: myColors.mainBackground,
    },
    errText: {
        marginBottom: 12,
        textAlign: 'center',
        color: 'red',
        fontWeight: 'bold'
    },
    buttonContainer: {
        margin: 6,
        alignSelf: 'center',
        flexWrap: "wrap",

    },
    imgContainer: {
        margin: 6,
        flex: 1,
        alignSelf: 'center',
        flexWrap: "wrap",

    },
    listRowImage: {
        height: 90,
        width: dimensions.width - 20,
        justifyContent: 'center',
    },
    avatarAndNameContainer: {
        margin: '10%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    senderNameTxtBox: {
        fontSize: 20,
        flex: 1,
        flexDirection: 'row',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center'
    },
    avatar: {
        flex: 1,
        height: 200,
        aspectRatio: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    cIcons: {
        flex: 1,
        height: 100,
        aspectRatio: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    modalView: {
        flexDirection: "row",
        backgroundColor: myColors.myMessage,
        height: 140,
        position: "absolute",
        bottom: 5,
        width: "100%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "space-around",
    },
})