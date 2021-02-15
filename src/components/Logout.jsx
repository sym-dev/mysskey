import { Link } from "react-router-dom";
import { IoPower } from "react-icons/io5";
import { useContext } from "react";
import { LoginContext } from "../App";

export default function Logout() {
  const { dispatch } = useContext(LoginContext);
  return (
    <Link
      onClick={() => {
        localStorage.clear();
        dispatch({
          type: "LOGOUT",
        });
      }}
      to="/login"
      className="button logout"
    >
      <IoPower fontSize="1.1em" className="ion-icon" />
      <p>Logout</p>
    </Link>
  );
}
