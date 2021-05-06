import AceEditor from "react-ace"
import axios from "axios"
import React, { useState, useEffect } from "react"

import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-java"

import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/ext-language_tools"

const CodeEditor = () => {
    const [code, setCode] = useState("")
    const [languageID, setLanguageID] = useState(53)
    const [langMode, setLangMode] = useState("c_cpp")
    useEffect(() => {
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
    }, [languageID])

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
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const onSubmitCode = (e) => {
        e.preventDefault()
        console.log(code)
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
                // stdin: encode("7\n11"),
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
            })
    }

    const onChangeCode = (newCode) => {
        setCode(newCode)
    }

    return (
        <div>
            <div>
                <h1>Code Editor</h1>
                <div className="alert alert-primary" role="alert">
                    A simple primary alert—check it out!
                </div>
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
                <form onSubmit={(e) => onSubmitCode(e)}>
                    <div className="d-flex justify-content-center">
                        <AceEditor
                            value={code}
                            mode={langMode}
                            theme="monokai"
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
                    <button type="submit">Click</button>
                </form>
            </div>
        </div>
    )
}
export default CodeEditor
