import "./App.css"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/HomePage"
import NotFound from "./components/NotFound"
import CodeEditor from "./components/CodeEditor"

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    {/* <Route exact path="/signin" component={Login} /> */}
                    {/* <Route exact path="/signup" component={Register} /> */}
                   
                    <Route exact path="/editor" component={CodeEditor} />
                    <Route component={NotFound} />
                </Switch>
            </div>
        </Router>
    )
}

export default App
