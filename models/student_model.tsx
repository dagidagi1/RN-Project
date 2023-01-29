

export type Student = {
    id: string,
    name: string,
    phone: string,
    img: string    
}
var students: Array<Student> = [
    {
        name: "Dagi",
        id: "12345",
        phone: "0544444445",
        img: "../assets/o.png"
    },
    {
        name: "tester1",
        id: "11111",
        phone: "111111111111",
        img: "../assets/x.png"
    },
    {
        name: "tester2",
        id: "22222",
        phone: "222222222222",
        img: "../assets/o.png"
    },
]

const getAllStudents = ()=>{
    console.log("get all students")
    return students
}
const addStudent = ( st: Student)=>{
    console.log("Add student")
    students.push(st)
}
const getStudentById = (id:string)=>{
    console.log("get student by id( ",id," )")
    let st:Student = {id:'',phone:'',name:'',img:''}
    students.forEach((i) =>{
        if(i.id === id) st = i
    })
    return st
}
export default {getAllStudents,getStudentById,addStudent}