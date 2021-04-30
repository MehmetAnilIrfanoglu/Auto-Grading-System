import { useState } from "react"
import { Link } from "react-router-dom"

const HomePage = () => {
    const [number, setNumber] = useState(1)

    return (
        <div>
            <h1>Welcome to Auto Grading System Homepage</h1>
            <h3>{number}</h3>
            <button onClick={() => setNumber(number + 1)}>Click</button>
        </div>
    )
}

export default HomePage
