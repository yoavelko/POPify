import { Link } from "react-router-dom"
import Login from "../loginPage/login"

function Homepage(params) {
    return (
        <div id="homepage-container">
            <Link to={'/login'}>to login</Link>
        </div>
    )
}

export default Homepage