import React, { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../Context"

var AutoGradingApi = require("auto_grading_api")

const Courses = ({ history }) => {
    const [login, setLogin] = useContext(UserContext)

    const [refresh, setRefresh] = useState(0)
    const [lectures, setLectures] = useState([])
    const [formName, setName] = useState("")
    const [lectureCards, setLectureCards] = useState([])

    let defaultClient = AutoGradingApi.ApiClient.instance
    let OAuth2PasswordBearer =
        defaultClient.authentications["OAuth2PasswordBearer"]
    OAuth2PasswordBearer.accessToken = login.userToken

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
            history.push("/")
        }
    }, [login, refresh])

    useEffect(() => {
        const lectureCardsArray = []
        for (let i = 0; i < lectures.length; i++) {
            lectureCardsArray.push(
                <div key={i} className="card w-25 m-4">
                    <div className="card-body">
                        <h5 className="card-title">{lectures[i].name}</h5>
                        <p className="card-text">
                            <div>
                                Student Number: {lectures[i].students.length}
                            </div>
                            <div>
                                Assignment Number:{" "}
                                {lectures[i].assignments.length}
                            </div>
                        </p>
                        <div className="d-flex justify-content-around">
                            <Link
                                to={`/lectures/${lectures[i]._id}`}
                                className="btn btn-primary"
                            >
                                Details
                            </Link>
                            {login.userGroup === "instructor" && (
                                <a
                                    onClick={() =>
                                        deleteLecture(lectures[i]._id)
                                    }
                                    className="btn btn-danger"
                                >
                                    Delete
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )
        }
        setLectureCards(lectureCardsArray)
    }, [lectures])

    const createLecture = (e) => {
        e.preventDefault()

        let apiInstance = new AutoGradingApi.LecturesApi()
        let uid = login.userID
        let lectureModel = new AutoGradingApi.LectureModel(formName)
        apiInstance.createLecture(
            uid,
            lectureModel,
            (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log(
                        "API called successfully. Returned data: " + data
                    )
                    setRefresh(refresh + 1)
                }
            }
        )
    }

    const deleteLecture = (lectureID) => {
        let apiInstance = new AutoGradingApi.LecturesApi()
        let uid = login.userID
        let lid = lectureID
        apiInstance.deleteLecture(uid, lid, (error, data, response) => {
            if (error) {
                console.error(error)
            } else {
                console.log("API called successfully. Returned data: " + data)
                setRefresh(refresh + 1)
            }
        })
    }

    return (
        <div>
            <h3>Courses</h3>
            {login.userGroup === "instructor" && (
                <div className="m-4 ">
                    <form onSubmit={createLecture.bind(this)}>
                        <input
                            className="form-control rounded-0"
                            id="fullname"
                            placeholder="Name of the Course"
                            required
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="off"
                        />
                        <div class="container my-3 bg-light">
                            <div class="col-md-12 text-center">
                                <button class="btn btn-primary">
                                    Create Course
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            <div className="d-flex flex-row flex-wrap">{lectureCards}</div>
        </div>
    )
}

export default Courses
