import { FC, useEffect, useState } from "react"
import { Button, View, Text, TextInput, StyleSheet } from "react-native"

const Login: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [email, setEmail] = useState<string>('enter your email')
    const [password, setPass] = useState<string>('*******')
    const validateEmail = () => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      }
    const login = () => {
        if(password.length > 7 && validateEmail()) console.log(email + password)
        else console.log("bad input")
    }
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="input email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                value={password}
                onChangeText={setPass}
            />
            <Button
                title="Login"
                onPress={login}
                
            />
            
        </View>
    );
}
const Register: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [msg, setMsg] = useState('non')
    const [counter, setCounter] = useState<number>(0)

    useEffect(() => {
        console.log('useEffect' + route.params?.newPostId)
        if (route.params?.newPostId) {
            setMsg(JSON.stringify(route.params?.newPostId))
        }
        if (route.params?.serial) {
            setCounter(route.params.serial)
        }
    })
    return (
        <View style={{
            flex: 1, alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text>{'Home Screen #' + counter}</Text>
            <Button
                title="Go to Details"
                onPress={() => navigation.navigate('Details', { newPostId: 123, name: 'testaaaaaa', serial: counter + 1 })}
            />
            <Button
                title="Go to add student"
                onPress={() => navigation.navigate('AddStudentScreen')}
            />
        </View>
    );
}
export default Login
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        textAlign: 'center'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
})