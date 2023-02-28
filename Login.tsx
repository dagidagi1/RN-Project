import { FC, useEffect, useState, useContext } from "react"
import { Button, View, Alert, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Image, TouchableHighlight, Dimensions, ScrollView, ToastAndroid, ActivityIndicator, Modal } from "react-native"
import user_api from "./api/user_api";
import { auth_model } from './models/auth_model'
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import user_model from "./models/user_model";
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
    const connectViaGoogle = () => { Alert.alert("TO-DO", 'Google connect!') }
    const connectViaFacebook = () => { Alert.alert("TO-DO", 'Facebook connect!') }
    const [waiting, setWaiting] = useState(false)
    useEffect(() => {
        if (route.params?.email) {
            setEmail(route.params?.email)
        }
        if (route.params?.pass) {
            setPass(route.params?.pass)
        }
    })
    const login = () => {
        if (password.length > 7 && validateEmail(email)) {
            console.log(email + password)
            //setToken('123')
            setLoading(true)
            auth_model.login(email, password).then((err) => {
                setLoading(false)
                console.log(err)
                if (err == '-1')
                    return
                else
                    ToastAndroid.show(err, ToastAndroid.LONG)

            })
        }
        else ToastAndroid.show('Invalid email or password', ToastAndroid.LONG)
    }
    if (waiting) return Loading()
    return (
        <ScrollView>
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
    const [imgUri, setImgUri] = useState('')
    const [newPhotoFlag, setNewPhotoFlag] = useState<boolean>(false)
    const [confPassword, setConfPassword] = useState<string>('')
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            askPermition()
            if (route.params?.editFlag) {
                setEditMode(true)
                setName(route.params?.username)
                setImgUri(route.params?.avatarUri)
                setEmail(route.params?.email)
                setPhone(route.params?.phone)
                setNewPhotoFlag(false)
            }
        })
        return unsubscribe
    }, [navigation])

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
        const inputErrMessage = checkInput()
        if (inputErrMessage === '') {
            setLoading(true)
            let url = 'http://192.168.59.246:3000/upload_files/usr_icon.jpg' // Default Image
            if (imgUri != '') { // User Image
                try { url = await user_model.uploadImage(imgUri) }
                catch (err) {
                    console.log('Failed to upload img')
                }
            }
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
    return (
        <ScrollView>
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
                            <Ionicons name="images" size={80} color={'red'} />
                            <Text style={{ color: 'green' }}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={openCamera}
                        >
                            <Ionicons name="camera" size={80} color={'green'} />
                            <Text style={{ color: 'green' }}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <ActivityIndicator animating={loading} size="large" />
                <TouchableHighlight onPress={() => setModalVisible(true)}>
                    {editMode ? (
                        <Image style={styles.avatar} source={{ uri: imgUri }}></Image>
                    ) : (
                        <Image style={styles.avatar} source={require('./assets/o.png')}></Image>

                    )}
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
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20,
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
        backgroundColor: 'gray',
        height: 140,
        position: "absolute",
        bottom: 5,
        width: "100%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "space-around",
    },
})