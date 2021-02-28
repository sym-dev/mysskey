import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

function NotLogin() {
  const [miauthState, updateMiauthState] = useState(
    "Mysskeyを利用するには、インスタンスがMiAuthに対応している必要があります。"
  );
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const id = uuid();
    const serviceURL = document.location.href.replace("localhost", "127.0.0.1");
    const instanceURL = data.instance;
    const checkURL = "https://" + instanceURL + "/api/endpoints";
    fetch(checkURL, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((text) => {
        if (text.includes("miauth/gen-token")) {
          localStorage.setItem("instanceURL", instanceURL);
          const appName = data.appName;
          const authURL =
            "https://" +
            instanceURL +
            "/miauth/" +
            id +
            "?" +
            "name=" +
            appName +
            "&callback=" +
            serviceURL +
            "&permission=read:account,write:account,write:notes";
          window.location.href = authURL;
        } else {
          updateMiauthState(
            <span style={{ color: "firebrick" }}>
              そのインスタンスはMiAuthに対応していないようです
            </span>
          );
        }
      })
      .catch((err) => {
        console.error(err);
        updateMiauthState(
          <span style={{ color: "chocolate" }}>
            それはMisskeyのインスタンスですか？
          </span>
        );
      });
  };
  return (
    <>
      <h3>ログインしてください。</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          アプリの名前:
          <input
            type="text"
            name="appName"
            onSubmit={handleSubmit(onSubmit)}
            ref={register}
            required
          />
        </label>
        <label>
          Instance:
          <input
            type="text"
            name="instance"
            onSubmit={handleSubmit(onSubmit)}
            ref={register}
            required
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <p>{miauthState}</p>
    </>
  );
}

export default NotLogin;
