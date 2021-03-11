import { Link } from "react-router-dom";
import Logout from "./Logout";

export default function Header() {
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
