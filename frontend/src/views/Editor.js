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

const CodeEditor = ({ history }) => {
    const [code, setCode] = useState("")
    const [input, setInput] = useState("")
    const [languageID, setLanguageID] = useState(53)
    const [langMode, setLangMode] = useState("c_cpp")
    const [theme, setTheme] = useState("chrome")
    const outputText = document.getElementById("output")

    const [login, setLogin] = useContext(UserContext)

    useEffect(() => {
        if (login) {
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
                } else {
                    //outputText.innerHTML = decode(response.data.compile_output);
                    outputText.innerHTML = response.data.status.description
                }
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const onSubmitCode = (e) => {
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
                <h1>Code Editor</h1>
                <div className="alert alert-primary" role="alert">
                    With our online code editor, you can try your codes without
                    submitting!
                </div>

                <div className="w-100">
                    <div className="d-flex flex-row justify-content-around my-4">
                        <div>
                            <label className="block mb-2 mr-2 text-md font-bold text-gray-700 text-left">
                                Select Language:
                            </label>
                            <select
                                value={languageID}
                                onChange={(e) => setLanguageID(e.target.value)}
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
                    <form onSubmit={(e) => onSubmitCode(e)}>
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
                        <div className="d-flex flex-row justify-content-around">
                            <div className="mt-2 ml-5">
                                <span className="badge badge-primary heading my-2 ">
                                    <i className="fas fa-user fa-fw fa-md"></i>{" "}
                                    User Input
                                </span>
                                <br />
                                <textarea
                                    id="input"
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
                            <button className="px-5 py-2" type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default CodeEditor
