import { Link } from "react-router-dom";
import { useContext } from "react";
import Logout from "./Logout";
import { LoginContext } from "../App";

function Header() {
  const loginState = useContext(LoginContext);
  return loginState.state.isLogin || localStorage.getItem("isLogin") ? (
    <Logined />
  ) : (
    <NotLogined />
  );
}

export default Header;

function Logined() {
  const userName = localStorage.getItem("UserName");
  return (
    <header className="top-header">
      <Link to="/" className="button">
        TimeLine
      </Link>
      <div className="user-block">
        <Link to={"/user/@" + userName} className="button">
          {userName}
        </Link>
        <Logout />
      </div>
    </header>
  );
}

function NotLogined() {
  return (
    <header style={{ textAlign: "center" }}>
      <h3>Mysskey</h3>
    </header>
  );
}
