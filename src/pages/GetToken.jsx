import { useHistory } from "react-router-dom";
import { useLoginContext } from "../utils/LoginContext";

const GetToken = (props) => {
  const history = useHistory();
  const { updateLogin } = useLoginContext();
  const tokenUrl =
    "https://" +
    localStorage.getItem("instanceURL") +
    "/api/miauth/" +
    props.uuid +
    "/check";
  fetchData(tokenUrl, history, updateLogin);
  return <h3>logining...</h3>;
};

export default GetToken;

function fetchData(tokenUrl, history, updateLogin) {
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
      if (text.token) {
        localStorage.setItem("isLogin", text.ok);
        localStorage.setItem("UserToken", text.token);
        localStorage.setItem("UserId", text.user.id);
        localStorage.setItem("UserName", text.user.username);
        console.log("hoge");
        Promise.all([fetchMeta(), fetchUser()]).then(() => {
          console.log("huga");
          updateLogin(true);
          history.push("/");
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

async function fetchMeta() {
  console.log("data");
  await fetch("https://" + localStorage.getItem("instanceURL") + "/api/meta", {
    method: "POST",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      localStorage.setItem("meta", JSON.stringify(text));
      Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
}
async function fetchUser() {
  console.log("user");
  const body = {
    username: localStorage.getItem("UserName"),
  };
  await fetch(
    "https://" + localStorage.getItem("instanceURL") + "/api/users/show",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      localStorage.setItem("user", JSON.stringify(text));
      Promise.resolve();
    })
    .catch((err) => {
      console.error(err);
      Promise.reject(err);
    });
}
