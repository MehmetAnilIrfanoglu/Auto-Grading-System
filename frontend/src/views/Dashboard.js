import React, { useEffect, useContext, useState } from "react"
import { UserContext } from "../Context"


var AutoGradingApi = require("auto_grading_api")
const Dashboard = ({ history }) => {
    const [refresh, setRefresh] = useState(0)
    const [login, setLogin] = useContext(UserContext)
    const [lectures, setLectures] = useState([])
    const [enrolledLectures, setenrolledLectures] = useState([])

    useEffect(() => {
        if (login) {
            let apiInstance = new AutoGradingApi.LecturesApi()
            let uid = login.userID
            apiInstance.listLectures(uid, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log(
                        "API called successfully. Returned data: " + data
                    )
                    setLectures(data)
                }
            })
        } else {
            history.push("/login")
        }
    }, [login, refresh])
    
    useEffect(() => {
      const enrolledLectureArray = []
        for (let i = 0; i < lectures.length; i++) {
            
                enrolledLectureArray.push(
                    <p class="title">Lecture Name: {lectures[i].name}</p>
                    
            )
        }
        setenrolledLectures(enrolledLectureArray)
    }, [lectures])

    return (
        <div class="card">
        <center>   
        <p></p>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        
        <h1>Welcome  {login.userName}</h1>
        <p class="title">Status: {login.userGroup.toUpperCase()}</p>
        <p class="title">Number: {login.userNumber}</p>
        <p>Abdullah Gül University</p>
      
        <a href="https://twitter.com/abdullahgul_unv" style={{margin: 7}}><i class="fa fa-twitter"></i></a>
        <a href="https://www.linkedin.com/school/abdullah-gul-university/?originalSubdomain=tr" style={{margin: 7}}><i class="fa fa-linkedin"></i></a>
        <a href="https://www.instagram.com/aguhayalim/" style={{margin: 7}}><i class="fa fa-instagram"></i></a>
        <p></p>
        <p><strong>Enrolled Courses as  {login.userGroup.toUpperCase()} : </strong>{enrolledLectures}</p>
        
        
        </center>
      </div>
      
    )
}

export default Dashboard
