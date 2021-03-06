import { Link } from "react-router-dom";
import Logout from "./Logout";
import { useLoginContext } from "../utils/LoginContext";

function Header() {
  const { isLogin } = useLoginContext();
  return isLogin || localStorage.getItem("isLogin") ? (
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
      <Link
        to="/"
        className="button"
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
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
