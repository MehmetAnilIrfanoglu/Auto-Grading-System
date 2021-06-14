import AceEditor from "react-ace"
import axios from "axios"
import React, { useState, useEffect, useContext } from "react"
import { UserContext } from "../Context"

import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-java"

import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/theme-dracula"
import "ace-builds/src-noconflict/theme-chrome"

import "ace-builds/src-noconflict/ext-language_tools"
import Beautify from "ace-builds/src-noconflict/ext-beautify"

const AutoGradingApi = require("auto_grading_api")

const CodeEditor = ({ history, match }) => {
    const lessonID = match.params.lid
    const assignmentID = match.params.aid

    const [code, setCode] = useState("")
    const [input, setInput] = useState("")
    const [languageID, setLanguageID] = useState(53)
    const [langMode, setLangMode] = useState("c_cpp")
    const [theme, setTheme] = useState("chrome")
    const outputText = document.getElementById("output")

    const [login, setLogin] = useContext(UserContext)
    const [refresh, setRefresh] = useState(0)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [assignment, setAssignment] = useState({})
    const [sampleInput, setSampleInput] = useState("")
    const [sampleOutput, setSampleOutput] = useState("")
    const [inputs, setInputs] = useState([])
    const [outputs, setOutputs] = useState([])
    const [scores, setScores] = useState([])
    const [studentScores, setStudentScores] = useState([])
    const [studentAPIScores, setStudentAPIScores] = useState([])
    const [totalGrade, setTotalGrade] = useState(0)
    const [studentGrade, setStudentGrade] = useState(0)

    const [name, setName] = useState("")
    const [detail, setDetail] = useState("")
    const [testcases, setTestcases] = useState([])
    const [formInput, setFormInput] = useState("")
    const [output, setOutput] = useState("")
    const [score, setScore] = useState("")

    let defaultClient = AutoGradingApi.ApiClient.instance
    let OAuth2PasswordBearer =
        defaultClient.authentications["OAuth2PasswordBearer"]
    OAuth2PasswordBearer.accessToken = login.userToken

    useEffect(() => {
        if (login) {
            if (lessonID && assignmentID) {
                let apiInstance = new AutoGradingApi.LecturesApi()
                let uid = login.userID
                let lid = lessonID
                apiInstance.getSingleLecture(
                    uid,
                    lid,
                    (error, data, response) => {
                        if (error) {
                            console.error(error)
                        } else {
                            console.log(
                                "API called successfully. Returned data: " +
                                    data
                            )
                            for (let i = 0; i < data.assignments.length; i++) {
                                if (data.assignments[i]._id == assignmentID) {
                                    setAssignment(data.assignments[i])
                                    setSampleInput(
                                        data.assignments[i].inputs[0]
                                    )
                                    setInput(data.assignments[i].inputs[0])
                                    setSampleOutput(
                                        data.assignments[i].outputs[0]
                                    )
                                    setInputs(data.assignments[i].inputs)
                                    setOutputs(data.assignments[i].outputs)
                                    setScores(data.assignments[i].scores)
                                    const tests = []
                                    let totGrade = 0

                                    for (
                                        let j = 0;
                                        j < data.assignments[i].inputs.length;
                                        j++
                                    ) {
                                        const newTestcase = {
                                            in: data.assignments[i].inputs[j],
                                            out: data.assignments[i].outputs[j],
                                            sc: data.assignments[i].scores[j],
                                        }
                                        tests.push(newTestcase)

                                        totGrade +=
                                            data.assignments[i].scores[j]
                                    }
                                    setTotalGrade(totGrade)
                                    setTestcases(tests)
                                    setName(data.assignments[i].name)
                                    setDetail(data.assignments[i].text)
                                }
                            }

                            const stuScr = []
                            for (let i = 0; i < data.students.length; i++) {
                                let isNA = false
                                for (
                                    let j = 0;
                                    j < data.students[i].grades.length;
                                    j++
                                ) {
                                    if (
                                        data.students[i].grades[j]
                                            .assignment_id === assignmentID
                                    ) {
                                        isNA = true
                                        let scr = 0
                                        for (
                                            let k = 0;
                                            k <
                                            data.students[i].grades[j].scores
                                                .length;
                                            k++
                                        ) {
                                            scr +=
                                                data.students[i].grades[j]
                                                    .scores[k]
                                        }

                                        const newStuScr = {
                                            name: data.students[i].name,
                                            number: data.students[i].number,
                                            score: scr,
                                        }
                                        stuScr.push(newStuScr)
                                    }
                                }
                                if (!isNA) {
                                    const newStuScr = {
                                        name: data.students[i].name,
                                        number: data.students[i].number,
                                        score: "NA",
                                    }
                                    stuScr.push(newStuScr)
                                }
                            }
                            setStudentScores(stuScr)
                        }
                    }
                )

                let apiInstanceGrade = new AutoGradingApi.GradesApi()
                let aid = assignmentID
                let sid = login.userNumber
                apiInstanceGrade.getSingleGrade(
                    lid,
                    aid,
                    sid,
                    (error, data, response) => {
                        if (error) {
                            console.error(error)
                        } else {
                            console.log(
                                "API called successfully. Returned data: " +
                                    data
                            )
                            let stuGrade = 0
                            for (let i = 0; i < data.scores.length; i++) {
                                stuGrade += data.scores[i]
                            }
                            setStudentAPIScores(data.scores)
                            setStudentGrade(stuGrade)
                            setIsSubmitted(true)
                        }
                    }
                )
            }
        } else {
            history.push("/")
        }
    }, [login, refresh, isSubmitted])

    useEffect(() => {
        if ("monokai" === theme) {
            setTheme("monokai")
        } else if ("dracula" === theme) {
            setTheme("dracula")
        } else {
            setTheme("chrome")
        }

        if (Number(languageID) === 53) {
            setLangMode("c_cpp")
            setCode(`#include <iostream>

int main() {
    std::cout << "Hello, world!";
    return 0;
}`)
        } else if (Number(languageID) === 62) {
            setLangMode("java")
            setCode(`class Main {  
    public static void main(String args[]) { 
        System.out.println("Hello, world!"); 
  } 
}`)
        } else {
            setLangMode("python")
            setCode(`print('Hello, world!')`)
        }
    }, [languageID, theme])

    const encode = (str) => {
        return btoa(unescape(encodeURIComponent(str || "")))
    }

    const decode = (bytes) => {
        var escaped = escape(atob(bytes || ""))
        try {
            return decodeURIComponent(escaped)
        } catch {
            return unescape(escaped)
        }
    }

    const fetchOutput = (token) => {
        outputText.innerHTML = "Checking Submission ..."
        const options = {
            method: "GET",
            url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "x-rapidapi-key":
                    "1e5a3ecf2cmsh767cd93b741e96bp1075c4jsn45925b00f995",
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
        }

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)

                console.log(decode(response.data.stdout))
                if (response.data.status.id === 3) {
                    outputText.innerHTML = decode(response.data.stdout)
                } else {
                    //outputText.innerHTML = decode(response.data.compile_output);
                    outputText.innerHTML = response.data.status.description
                }
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const onCheckCode = (e) => {
        e.preventDefault()

        console.log(code)
        outputText.innerHTML = "Creating Submission ..."
        const options = {
            method: "POST",
            url: "https://judge0-ce.p.rapidapi.com/submissions",
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "content-type": "application/json",
                "x-rapidapi-key":
                    "1e5a3ecf2cmsh767cd93b741e96bp1075c4jsn45925b00f995",
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
            data: {
                source_code: encode(code),
                language_id: Number(languageID),
                stdin: encode(input),
            },
        }

        axios
            .request(options)
            .then(function (response) {
                console.log(response.data)
                fetchOutput(response.data.token)
            })
            .catch(function (error) {
                console.error(error)
                outputText.innerHTML = "Submission Failed ..."
            })
    }

    const onSubmitCode = (e) => {
        e.preventDefault()

        console.log(code)
        outputText.innerHTML = "Creating Submission ..."

        const studentScoreArray = []

        for (let i = 0; i < inputs.length; i++) {
            const options = {
                method: "POST",
                url: "https://judge0-ce.p.rapidapi.com/submissions",
                params: { base64_encoded: "true", fields: "*" },
                headers: {
                    "content-type": "application/json",
                    "x-rapidapi-key":
                        "1e5a3ecf2cmsh767cd93b741e96bp1075c4jsn45925b00f995",
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                },
                data: {
                    source_code: encode(code),
                    language_id: Number(languageID),
                    stdin: encode(inputs[i]),
                },
            }

            axios
                .request(options)
                .then(function (response) {
                    let output
                    outputText.innerHTML = "Checking Submission ..."
                    const options = {
                        method: "GET",
                        url: `https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}`,
                        params: { base64_encoded: "true", fields: "*" },
                        headers: {
                            "x-rapidapi-key":
                                "1e5a3ecf2cmsh767cd93b741e96bp1075c4jsn45925b00f995",
                            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        },
                    }

                    axios
                        .request(options)
                        .then(function (response) {
                            console.log(response.data)

                            console.log(decode(response.data.stdout))
                            if (response.data.status.id === 3) {
                                outputText.innerHTML = decode(
                                    response.data.stdout
                                )
                                output = decode(response.data.stdout)
                                if (outputs[i] === output) {
                                    studentScoreArray.push(scores[i])
                                } else {
                                    studentScoreArray.push(0)
                                }
                            } else {
                                //outputText.innerHTML = decode(response.data.compile_output);
                                outputText.innerHTML =
                                    response.data.status.description
                            }
                        })
                        .then(function () {
                            if (studentScoreArray.length === inputs.length) {
                                let apiInstance = new AutoGradingApi.GradesApi()
                                let lid = lessonID
                                let sid = login.userNumber
                                let studentGradeModel =
                                    new AutoGradingApi.StudentGradeModel(
                                        assignment.name,
                                        assignmentID,
                                        studentScoreArray
                                    )
                                apiInstance.createGrade(
                                    lid,
                                    sid,
                                    studentGradeModel,
                                    (error, data, response) => {
                                        if (error) {
                                            console.error(error)
                                        } else {
                                            console.log(
                                                "API called successfully. Returned data: " +
                                                    data
                                            )
                                            setRefresh(refresh + 1)
                                            setIsSubmitted(true)
                                        }
                                    }
                                )
                            }
                        })
                        .catch(function (error) {
                            console.error(error)
                        })
                })
                .catch(function (error) {
                    console.error(error)
                    outputText.innerHTML = "Submission Failed ..."
                })
        }
    }

    const addTestcase = (e) => {
        e.preventDefault()

        const newTestcase = { in: formInput, out: output, sc: score }
        setTestcases([...testcases, newTestcase])
        setFormInput("")
        setOutput("")
        setScore("")
    }

    const deleteTestcase = (e, curIndex) => {
        e.preventDefault()
        setTestcases(testcases.filter((testcase, index) => index !== curIndex))
    }

    const updateAssignment = (e) => {
        e.preventDefault()

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
        let aid = assignmentID
        let assignmentModel = new AutoGradingApi.AssignmentModel(
            name,
            detail,
            inputs,
            outputs,
            scores
        )
        apiInstance.updateAssignment(
            uid,
            lid,
            aid,
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

    const userInput = (event) => {
        setInput(event.target.value)
        console.log(input)
    }

    const onChangeCode = (newCode) => {
        setCode(newCode)
    }

    return (
        <div className="m-4">
            <div>
                <h1>Assignment Detail: {assignment.name}</h1>
                {login.userGroup == "student" ? (
                    <div>
                        <div className="alert alert-primary" role="alert">
                            Check your code before submission!
                        </div>
                        <div className="d-flex flex-row">
                            <div className="w-50">
                                <center>
                                    <h3>{assignment.name}</h3>
                                </center>
                                <div className="d-flex flex-row mx-4 my-2 p-2">
                                    Assignment Explanation:
                                </div>
                                <div className="d-flex flex-row mx-4 my-2 p-2 h-50 border border-primary">
                                    {assignment.text}
                                </div>
                                <div className="d-flex flex-row mx-4 my-2 p-2 border border-primary">
                                    Sample Input: {sampleInput}
                                </div>
                                <div className="d-flex flex-row mx-4 my-2 p-2 border border-primary">
                                    Sample Output: {sampleOutput}
                                </div>
                            </div>
                            <div className="w-50">
                                {!isSubmitted ? (
                                    <div>
                                        <div className="d-flex flex-row justify-content-around my-4">
                                            <div>
                                                <label className="block mb-2 mr-2 text-md font-bold text-gray-700 text-left">
                                                    Select Language:
                                                </label>
                                                <select
                                                    value={languageID}
                                                    onChange={(e) =>
                                                        setLanguageID(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 mb-3 text-base leading-medium text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline bg-white"
                                                    id="university"
                                                >
                                                    <option value="53">
                                                        C++
                                                    </option>
                                                    <option value="62">
                                                        Java
                                                    </option>
                                                    <option value="70">
                                                        Python
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block mb-2 mr-2 text-md font-bold text-gray-700 text-left">
                                                    Select Theme:
                                                </label>
                                                <select
                                                    value={theme}
                                                    onChange={(e) =>
                                                        setTheme(e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 mb-3 text-base leading-medium text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline bg-white"
                                                    id="university"
                                                >
                                                    <option value="monokai">
                                                        Monokai
                                                    </option>
                                                    <option value="chrome">
                                                        Chrome
                                                    </option>
                                                    <option value="dracula">
                                                        Dracula
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <form>
                                            <div className="d-flex justify-content-center">
                                                <AceEditor
                                                    value={code}
                                                    mode={langMode}
                                                    commands={Beautify.commands}
                                                    theme={theme}
                                                    onChange={onChangeCode}
                                                    name="UNIQUE_ID_OF_DIV"
                                                    editorProps={{
                                                        $blockScrolling: true,
                                                    }}
                                                    setOptions={{
                                                        enableBasicAutocompletion: true,
                                                        enableLiveAutocompletion: true,
                                                        enableSnippets: true,
                                                    }}
                                                />
                                            </div>
                                            <div className="mx-4 my-2 d-flex flex-row justify-content-around">
                                                <div className="mt-2 ml-5">
                                                    <span className="badge badge-primary heading my-2 ">
                                                        <i className="fas fa-user fa-fw fa-md"></i>{" "}
                                                        Input
                                                    </span>
                                                    <br />
                                                    <textarea
                                                        id="input"
                                                        value={sampleInput}
                                                        onChange={userInput}
                                                    ></textarea>
                                                </div>

                                                <div className="mt-2 ml-5">
                                                    <span className="badge badge-primary heading my-2 ">
                                                        <i className="fas fa-user fa-fw fa-md"></i>{" "}
                                                        Output
                                                    </span>
                                                    <br />
                                                    <textarea id="output"></textarea>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className="px-5 py-2 mx-2"
                                                    onClick={(e) =>
                                                        onCheckCode(e)
                                                    }
                                                >
                                                    Check
                                                </button>
                                                <button
                                                    className="px-5 py-2 mx-2"
                                                    onClick={(e) =>
                                                        onSubmitCode(e)
                                                    }
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div>
                                        <center>
                                            <h3>
                                                Grade: {studentGrade}/
                                                {totalGrade}
                                            </h3>
                                        </center>
                                        <div className="d-flex flex-row mx-4 my-2 p-2">
                                            Testcases:
                                        </div>
                                        <div className="d-flex flex-row mx-4 my-2 p-2 h-50 border border-primary">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">
                                                            Input
                                                        </th>
                                                        <th scope="col">
                                                            Output
                                                        </th>
                                                        <th scope="col">
                                                            Score
                                                        </th>
                                                        <th scope="col">
                                                            Result
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inputs.map(
                                                        (input, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <th scope="row">
                                                                        {index}
                                                                    </th>
                                                                    <td>
                                                                        {input}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            outputs[
                                                                                index
                                                                            ]
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            scores[
                                                                                index
                                                                            ]
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {studentAPIScores[
                                                                            index
                                                                        ] !==
                                                                        0 ? (
                                                                            <i className="fas fa-check"></i>
                                                                        ) : (
                                                                            <i className="fas fa-times"></i>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-row mx-4">
                        <div className="my-4 w-50">
                            <h5>Update Assignment</h5>
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
                                            value={formInput}
                                            onChange={(e) =>
                                                setFormInput(e.target.value)
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
                                    <h5>
                                        {testcases.length > 0 && "Testcases"}
                                    </h5>
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
                                                    onClick={(e) =>
                                                        deleteTestcase(e, index)
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
                                    onClick={(e) => updateAssignment(e)}
                                >
                                    Update Assignment
                                </button>
                            </form>
                        </div>

                        <div className="my-4 w-50">
                            <h5 className="d-flex justify-content-center">
                                Students: {studentScores.length}
                            </h5>

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
                                        <th scope="col">Grade: {totalGrade}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentScores.map(
                                        (studentGrade, index) => {
                                            return (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        {index + 1}
                                                    </th>
                                                    <td>{studentGrade.name}</td>
                                                    <td>
                                                        {studentGrade.number}
                                                    </td>
                                                    <td>
                                                        {studentGrade.score}
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default CodeEditor
