import { FC, useEffect, useState, useContext } from "react"
import { Button, View, Alert, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Image, TouchableHighlight, Dimensions, ScrollView, ToastAndroid, ActivityIndicator } from "react-native"
import user_api from "./api/user_api";
import { auth_model } from './models/auth_model'
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
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [password, setPass] = useState<string>('')
    const [confPassword, setConfPassword] = useState<string>('')
    const loadImg = () => { Alert.alert('TO-DO', 'load image') }
    const onRegisterPressed = () => {
        //Check input: 
        setLoading(true)
        let txt = ''
        if (name.length < 2) txt += 'name, '
        if (!validatePass(password)) txt += 'password, '
        if (!validateEmail(email)) txt += 'email, '
        if (password != confPassword) txt += 'passwords not match, '
        if (!validatePhone(phone)) txt += 'phone, '
        if (txt === '') {
            // Add spinner and connect to model.
            // if success:
            user_api.registerUser({
                email: email,
                password: password,
                phone: phone,
                name: name,
                img: '123'
            }).then((res: any) => {
                setLoading(false)
                if (res.status == 200)
                    navigation.navigate('Login', { email: email, pass: password })
                else
                    ToastAndroid.show(res.data.message, ToastAndroid.LONG)
            })
        }
        else {
            ToastAndroid.show('Invalid ' + txt, ToastAndroid.LONG)
            setLoading(false)
        }
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <ActivityIndicator animating={loading} size="large" />
                <TouchableHighlight onPress={loadImg}>
                    <Image style={styles.avatar} source={require('./assets/o.png')}></Image>
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
                    <Button
                        title="Register"
                        onPress={onRegisterPressed}
                    />
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
})