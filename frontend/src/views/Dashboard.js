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
        <div class="container emp-profile">
        <form method="post">
            <div class="row">
                <div class="col-md-4">
                    <div class="profile-img">
                        <img src="https://www.freeiconspng.com/uploads/customers-icon-3.png" alt="" width="250" height="230"  />
                        
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="profile-head">
                        <p></p>
                                <h1>
                                Welcome {login.userName}
                                </h1>
                                <h6>
                                <p class="title">{login.userGroup.toUpperCase()}</p>
                                </h6>
                                <p class="proile-rating">Abdullah Gul University </p>
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
                            </li>
                           
                        </ul>
                        <p></p>
                    </div>
                </div>
               
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="profile-work">
                    <p></p>
                        <p>Abdullah Gul University Social Media</p>
                        <a href="https://twitter.com/abdullahgul_unv">Twitter</a><i class="fa fa-twitter"></i><br/>
                        <a href="https://www.linkedin.com/school/abdullah-gul-university/?originalSubdomain=tr">LinkedIn</a> <i class="fa fa-linkedin"></i><br/>
                        <a href="https://www.instagram.com/aguhayalim/">Instagram <i class="fa fa-instagram"></i></a>
                        <p></p>
                        <p>
                    <strong>
                        Enrolled Courses as {login.userGroup.toUpperCase()} :{" "}
                    </strong>
                    {enrolledLectures}
                </p>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="tab-content profile-tab" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>User Id</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>{login.userNumber}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Name</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>{login.userName}</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Email</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>{login.userEmail}</p>
                                        </div>
                                    </div>
                                   
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Status</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>{login.userGroup.toUpperCase()}</p>
                                        </div>
                                    </div>
                        </div>
                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Experience</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>Expert</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Hourly Rate</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>10$/hr</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Total Projects</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>230</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>English Level</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>Expert</p>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>Availability</label>
                                        </div>
                                        <div class="col-md-6">
                                            <p>6 months</p>
                                        </div>
                                    </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <label>Your Bio</label><br/>
                                    <p>Your detail description</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>           
    </div>
    )
}

export default Dashboard
