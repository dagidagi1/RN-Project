import { StatusBar } from 'expo-status-bar';
import { FC, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Button, TextInput, FlatList, TouchableHighlight } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import post_model, { Post } from './models/post_model';
import student_model from './models/student_model';
import { Student } from './models/student_model';

const sts = student_model.getAllStudents()
const StudentsList: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const [data, setData] = useState<Array<Post>>(post_model.getAllPosts())
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', ()=> {
            setData(post_model.getAllPosts())
        })
        return unsubscribe
    },[navigation])
    const onRowSelected = (id: string) => {
        console.log('in the list:, row was selected ' + id)
        navigation.navigate('Details', {post: post_model.getPostById(id)})}
    const posts: Array<Post> = data
    return (
        <FlatList style={styles.flatlist}
            data={posts}
            keyExtractor={post => post.id.toString()}
            renderItem={({ item }) => (
                <ListItem txt={item.txt} id={item.id} image={item.img} onRowSelected={onRowSelected} />
            )}>
        </FlatList>
    )
            }
export const ListItem: FC<{ txt: string, id: string, image: string, onRowSelected: (id: string) => void }> =
    ({ txt, id, image, onRowSelected }) => {
        return (
            <TouchableHighlight
                onPress={() => onRowSelected(id)}
                underlayColor={Colors.table_selected}>
                <View style={styles.listRow} >
                    <Image style={styles.listRowImage}
                        source={require("./assets/o.png")} />
                    <View style={styles.listRowTextContainer}>
                        <Text style={styles.listRowName}> {txt} </Text>
                        < Text style={styles.listRowId} > {id} </Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
export default StudentsList
const styles = StyleSheet.create({
    listRow: {
        margin: 4,
        flexDirection: "row",
        height: 150,
        elevation: 1,
        borderRadius: 2,
    },
    flatlist: {
        flex: 1,
        marginTop: 35
    },
    listRowImage: {
        margin: 10,
        resizeMode: "contain",
        height: 130,
        width: 130,
    },
    listRowTextContainer: {
        flex: 1,
        margin: 10,
        justifyContent: "space-around"
    },
    listRowName: {
        fontSize: 30
    },
    listRowId: {
        fontSize: 25
    }
})