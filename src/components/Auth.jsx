import { Redirect } from "react-router-dom";

const Auth = (props) =>
  localStorage.getItem("isLogin") ? props.children : <Redirect to={"/login"} />;

export default Auth;
