import React, { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../Context"

var AutoGradingApi = require("auto_grading_api")

const CourseDetail = ({ history, match }) => {
    const lessonID = match.params.id

    const [login, setLogin] = useContext(UserContext)

    const [refresh, setRefresh] = useState(0)

    const [lecture, setLecture] = useState({})
    const [assignments, setAssignments] = useState([])
    const [students, setStudents] = useState([])
    const [addedStudets, setAddedStudents] = useState([])
    const [selectedStudents, setSelectedStudents] = useState([])

    const [name, setName] = useState("")
    const [detail, setDetail] = useState("")
    const [testcases, setTestcases] = useState([])
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [score, setScore] = useState("")

    let defaultClient = AutoGradingApi.ApiClient.instance
    let OAuth2PasswordBearer =
        defaultClient.authentications["OAuth2PasswordBearer"]
    OAuth2PasswordBearer.accessToken = login.userToken

    useEffect(() => {
        if (login) {
            let apiInstance = new AutoGradingApi.LecturesApi()
            let uid = login.userID
            let lid = lessonID
            apiInstance.getSingleLecture(uid, lid, (error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log(
                        "API called successfully. Returned data: " + data
                    )
                    setLecture(data)
                    setAssignments(data.assignments)
                    setAddedStudents(data.students)
                }
            })

            let apiInstanceStudent = new AutoGradingApi.UsersApi()
            apiInstanceStudent.getStudentList((error, data, response) => {
                if (error) {
                    console.error(error)
                } else {
                    console.log(
                        "API called successfully. Returned data: " + data
                    )
                    setStudents(data)
                }
            })
        } else {
            history.push("/")
        }
    }, [login, lessonID, refresh])

    const addStudents = () => {
        for (let i = 0; i < selectedStudents.length; i++) {
            let apiInstance = new AutoGradingApi.StudentsApi()
            let uid = login.userID
            let lid = lessonID
            let studentModel = new AutoGradingApi.StudentModel(
                selectedStudents[i].name,
                selectedStudents[i].number
            )
            apiInstance.createStudent(
                uid,
                lid,
                studentModel,
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
    }

    const deleteStudent = (studentID) => {
        const student = addedStudets.find((o) => o.number === studentID)

        if (student) {
            let apiInstance = new AutoGradingApi.StudentsApi()
            let uid = login.userID
            let lid = lessonID
            let sid = student._id
            apiInstance.deleteStudent(
                uid,
                lid,
                sid,
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
    }

    const createAssignment = (e) => {
        e.preventDefault()

        const assignment = assignments.find((o) => o.name === name.trim())

        if (!assignment) {
            const inputs = []
            const outputs = []
            const scores = []

            for (let i = 0; i < testcases.length; i++) {
                inputs.push(testcases[i].in)
                outputs.push(testcases[i].out)
                scores.push(testcases[i].sc)
            }

            let apiInstance = new AutoGradingApi.AssignmentsApi()
            let uid = login.userID
            let lid = lessonID
            let assignmentModel = new AutoGradingApi.AssignmentModel(
                name,
                detail,
                inputs,
                outputs,
                scores
            )
            apiInstance.createAssignment(
                uid,
                lid,
                assignmentModel,
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

        setName("")
        setDetail("")
        setTestcases([])
    }

    const deleteAssignment = (assignmentID) => {
        let apiInstance = new AutoGradingApi.AssignmentsApi()
        let uid = login.userID
        let lid = lessonID
        let aid = assignmentID
        apiInstance.deleteAssignment(uid, lid, aid, (error, data, response) => {
            if (error) {
                console.error(error)
            } else {
                console.log("API called successfully. Returned data: " + data)
                setRefresh(refresh + 1)
            }
        })
    }

    const addTestcase = (e) => {
        e.preventDefault()

        const newTestcase = { in: input, out: output, sc: score }
        setTestcases([...testcases, newTestcase])
        setInput("")
        setOutput("")
        setScore("")
    }

    const deleteTestcase = (curIndex) => {
        setTestcases(testcases.filter((testcase, index) => index !== curIndex))
    }

    const selectStudents = (newStudent) => {
        if (selectedStudents.includes(newStudent)) {
            setSelectedStudents(
                selectedStudents.filter((student) => student !== newStudent)
            )
        } else {
            setSelectedStudents([...selectedStudents, newStudent])
        }
    }

    return (
        <div className="m-4">
            <h3>Lecture: {lecture.name}</h3>
            {login.userGroup === "instructor" && (
                <div>
                    <div className="my-4">
                        <h5>Create Assignment</h5>
                        <form className="d-flex flex-column">
                            <textarea
                                class="form-control rounded-0"
                                id="fullname"
                                placeholder="Name of the assignment"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="off"
                            />
                            <textarea
                                style={{
                                    Height: "100%",
                                    overflowY: "auto",
                                }}
                                class="form-control rounded-0"
                                id="detail"
                                placeholder="Detail of the assignment"
                                type="textarea"
                                required
                                value={detail}
                                onChange={(e) => setDetail(e.target.value)}
                                autoComplete="off"
                            ></textarea>
                            <div className="my-2 d-flex flex-row justify-content-around">
                                <div>
                                    <textarea
                                        class="form-control rounded-0"
                                        id="input"
                                        placeholder="Input for a testcase"
                                        type="textarea"
                                        value={input}
                                        onChange={(e) =>
                                            setInput(e.target.value)
                                        }
                                        autoComplete="off"
                                    ></textarea>
                                </div>
                                <div>
                                    <textarea
                                        class="form-control rounded-0"
                                        id="output"
                                        placeholder="Output for a testcase"
                                        type="textarea"
                                        value={output}
                                        onChange={(e) =>
                                            setOutput(e.target.value)
                                        }
                                        autoComplete="off"
                                    ></textarea>
                                </div>
                                <div>
                                    <input
                                        className="form-control rounded-0"
                                        id="score"
                                        placeholder="Score for a testcase"
                                        value={score}
                                        onChange={(e) =>
                                            setScore(e.target.value)
                                        }
                                        autoComplete="off"
                                    ></input>
                                </div>
                                <button onClick={(e) => addTestcase(e)}>
                                    Add Testcase
                                </button>
                            </div>
                            <div>
                                <h5>
                                    {testcases.length === 0 &&
                                        "At least one testcase is required"}
                                </h5>
                                <h5>{testcases.length > 0 && "Testcases"}</h5>
                                {testcases.map((testcase, index) => {
                                    return (
                                        <div className="d-flex flex-row mx-4 my-2 p-2 justify-content-around border border-primary">
                                            <div className="text-left">
                                                Input: {testcase.in}
                                            </div>
                                            <div className="text-left">
                                                Output: {testcase.out}
                                            </div>
                                            <div className="text-left">
                                                Score: {testcase.sc}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    deleteTestcase(index)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                            <button
                                className="d-flex justify-content-center my-2 p-2"
                                onClick={(e) => createAssignment(e)}
                            >
                                Create Assignment
                            </button>
                        </form>
                    </div>

                    <div>
                        <h5>Students: {addedStudets.length}</h5>

                        <table
                            class="table"
                            style={{
                                marginLeft: 20,
                                maxHeight: "1px",
                                overflowY: "auto",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Number</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{student.name}</td>
                                            <td>{student.number}</td>
                                            <td>
                                                <input
                                                    className="mx-4"
                                                    onChange={() =>
                                                        selectStudents(student)
                                                    }
                                                    checked={selectedStudents.find(
                                                        (o) =>
                                                            o.number ===
                                                            student.number
                                                    )}
                                                    disabled={addedStudets.find(
                                                        (o) =>
                                                            o.number ===
                                                            student.number
                                                    )}
                                                    type="checkbox"
                                                ></input>
                                                <i
                                                    onClick={() =>
                                                        deleteStudent(
                                                            student.number
                                                        )
                                                    }
                                                    className="fas fa-times"
                                                ></i>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <button onClick={() => addStudents()}>
                        Add Selected Students
                    </button>
                </div>
            )}
            <div className="my-4">
                <h5>Assignments</h5>
                {assignments.map((assignment, index) => {
                    return (
                        <div
                            className="mx-4 my-2 p-2 d-flex flex-row justify-content-around border border-primary"
                            key={index}
                        >
                            <h6>{assignment.name}</h6>
                            <Link
                                to={`/assignments/${lessonID}/${assignment._id}`}
                                className="btn btn-primary"
                            >
                                Details
                            </Link>
                            {login.userGroup === "instructor" && (
                                <a
                                    onClick={() =>
                                        deleteAssignment(assignment._id)
                                    }
                                    className="btn btn-danger"
                                >
                                    Delete
                                </a>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CourseDetail
