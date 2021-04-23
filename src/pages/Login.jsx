import React from "react";
import { Redirect } from "react-router-dom";

import NotLogin from "./NotLogin";
import GetToken from "./GetToken";

export default function Login() {
  let session = getUuid();
  return localStorage.getItem("isLogin") ? (
    <Redirect to={"/"} />
  ) : session !== null ? (
    <GetToken uuid={session} />
  ) : (
    <NotLogin />
  );
}

function getUuid() {
  let params = new URLSearchParams(document.location.search.substring(1));
  let session = params.get("session");
  return session;
}
