import { Link } from "react-router-dom"
import Login from "../login/Login"

function Homepage(params) {
    return (
        <div id="homepage-container">
            <Link to={'/login'}>to login</Link>
        </div>
    )
}

export default Homepage