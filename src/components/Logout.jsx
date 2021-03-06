import { Link } from "react-router-dom";
import { IoPower } from "react-icons/io5";
import { useLoginContext } from "../utils/LoginContext";

export default function Logout() {
  const { updateLogin } = useLoginContext();
  return (
    <Link
      onClick={() => {
        localStorage.clear();
        updateLogin(false);
      }}
      to="/login"
      className="button logout"
    >
      <IoPower fontSize="1.1em" className="ion-icon" />
      <p>Logout</p>
    </Link>
  );
}
