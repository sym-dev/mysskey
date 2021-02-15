import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";

function NotLogin() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const id = uuid();
    const serviceURL = document.location.href.replace("localhost", "127.0.0.1");
    const instanceURL = data.instance;
    localStorage.setItem("instanceURL", instanceURL);
    const appName = data.appName;
    const authUrl =
      "http://" +
      instanceURL +
      "/miauth/" +
      id +
      "?" +
      "name=" +
      appName +
      "&callback=" +
      serviceURL +
      "&permission=read:account,write:account,write:notes";
    window.location.href = authUrl;
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
    </>
  );
}

export default NotLogin;
