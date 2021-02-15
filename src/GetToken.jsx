import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { LoginContext } from "./App";

const GetToken = (props) => {
  const history = useHistory();
  const { dispatch } = useContext(LoginContext);
  const tokenUrl =
    "https://" +
    localStorage.getItem("instanceURL") +
    "/api/miauth/" +
    props.uuid +
    "/check";
  // console.log(tokenUrl);
  fetch(tokenUrl, {
    method: "POST",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      if (text.token !== undefined) {
        localStorage.setItem("isLogin", text.ok);
        localStorage.setItem("UserToken", text.token);
        localStorage.setItem("UserId", text.user.id);
        localStorage.setItem("UserName", text.user.username);
        dispatch({
          type: "LOGIN",
        });
        history.push("/");
      }
    })
    .catch((err) => {
      console.error(err);
    });
  return <h3>logining...</h3>;
};

export default GetToken;
