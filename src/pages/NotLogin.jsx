import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

function NotLogin() {
  useEffect(() => {
    if (document.location.href.includes("localhost")) {
      document.location = document.location.href.replace(
        "localhost",
        "127.0.0.1"
      );
    }
  }, []);
  const [miauthState, updateMiauthState] = useState(
    "Mysskeyを利用するには、インスタンスがMiAuthに対応している必要があります。"
  );
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log(data);
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
            "&permission=read:account,write:account,read:blocks,write:blocks,read:drive,write:drive,read:favorites,write:favorites,read:following,write:following,read:messaging,write:messaging,read:mutes,write:mutes,write:notes,read:notifications,write:notifications,read:reactions,write:reactions,write:votes,read:pages,write:pages,write:page-likes,read:page-likes,read:user-groups,write:user-groups,read:channels,write:channels,read:gallery,write:gallery,read:gallery-likes,write:gallery-likes";
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
    <div className="NotLogin">
      <header>Mysskey</header>
      <main>
        <h3>ログインしてください。</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            アプリの名前:
            <input
              type="text"
              {...register("appName")}
              onSubmit={handleSubmit(onSubmit)}
              placeholder="mysskey"
              required
            />
          </label>
          <label>
            Instance:
            <input
              type="text"
              {...register("instance")}
              onSubmit={handleSubmit(onSubmit)}
              placeholder="example.com"
              required
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>{miauthState}</p>
      </main>
    </div>
  );
}

export default NotLogin;
