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

    const [assignment, setAssignment] = useState({})
    const [sampleInput, setSampleInput] = useState("")
    const [sampleOutput, setSampleOutput] = useState("")
    const [inputs, setInputs] = useState([])
    const [outputs, setOutputs] = useState([])
    const [scores, setScores] = useState([])
    const [currentOutput, setCurrentOutput] = useState("")
    const [studentScores, setStudentScores] = useState([])

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
                                }
                            }
                        }
                    }
                )
            }
        } else {
            history.push("/")
        }
    }, [login])

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
                    setCurrentOutput(decode(response.data.stdout))
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
                                    console.log("if")
                                    studentScoreArray.push(scores[i])
                                } else {
                                    console.log("else")
                                    studentScoreArray.push(0)
                                }
                                if (i == inputs.length - 1) {
                                    console.log(studentScoreArray)
                                }
                            } else {
                                //outputText.innerHTML = decode(response.data.compile_output);
                                outputText.innerHTML =
                                    response.data.status.description
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

        setStudentScores(studentScoreArray)
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
                        <div className="d-flex flex-row justify-content-around my-4">
                            <div>
                                <label className="block mb-2 mr-2 text-md font-bold text-gray-700 text-left">
                                    Select Language:
                                </label>
                                <select
                                    value={languageID}
                                    onChange={(e) =>
                                        setLanguageID(e.target.value)
                                    }
                                    className="w-full px-3 py-2 mb-3 text-base leading-medium text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline bg-white"
                                    id="university"
                                >
                                    <option value="53">C++</option>
                                    <option value="62">Java</option>
                                    <option value="70">Python</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 mr-2 text-md font-bold text-gray-700 text-left">
                                    Select Theme:
                                </label>
                                <select
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="w-full px-3 py-2 mb-3 text-base leading-medium text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline bg-white"
                                    id="university"
                                >
                                    <option value="monokai">Monokai</option>
                                    <option value="chrome">Chrome</option>
                                    <option value="dracula">Dracula</option>
                                </select>
                            </div>
                        </div>
                        <form>
                            <div className="d-flex justify-content-center">
                                <AceEditor
                                    value={code}
                                    mode={langMode}
                                    theme={theme}
                                    onChange={onChangeCode}
                                    name="UNIQUE_ID_OF_DIV"
                                    editorProps={{ $blockScrolling: true }}
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
                                    onClick={(e) => onCheckCode(e)}
                                >
                                    Check
                                </button>
                                <button
                                    className="px-5 py-2 mx-2"
                                    onClick={(e) => onSubmitCode(e)}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CodeEditor
