import {Link} from "react-router-dom";

function Home() {
    return (
        <div className="home">
            <h1>Чуи, мы дома</h1>
            <Link to="/auth">
                <h6>
                    страница авторизации
                </h6>
            </Link>
        </div>
    )
}
export default Home;