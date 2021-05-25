import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSettings } from "react-icons/io5";
import { useHeaderContext } from "../utils/HeaderContext";

export default function Settings() {
  let settings = JSON.parse(localStorage.getItem("settings"));
  const { updateHeaderValue } = useHeaderContext();
  const { register, handleSubmit } = useForm();
  const [isSubmitted, updateSubmit] = useState(false);
  const onSubmit = (data) => {
    updateSubmit(true);
    localStorage.setItem(
      "settings",
      JSON.stringify({
        auto_motto: data.auto_motto,
      })
    );
  };
  useEffect(() => {
    updateHeaderValue(
      <>
        <IoSettings fontSize="1.2em" />
        Settings
      </>
    );
  }, [updateHeaderValue]);
  return (
    <div id="settings">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="buttonContainer">
          <input
            id="auto_motto"
            type="checkbox"
            {...register("auto_motto")}
            defaultChecked={settings.auto_motto}
          />
          <label htmlFor="auto_motto">自動でもっと見る</label>
        </div>
        <input
          type="submit"
          value={isSubmitted ? "保存しました" : "保存"}
          disabled={isSubmitted}
        />
      </form>
      <hr />
      <div className="about">
        <h3>Mysskeyについて</h3>
        <p>Mysskeyはオープンソースで提供されています。</p>
        <p>
          <a
            href="https://github.com/sym-dev/mysskey"
            target="_blank"
            rel="noopener noreferrer"
          >
            リポジトリ(GitHub)
          </a>{" "}
          - by{" "}
          <a
            href="https://github.com/sym-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sym
          </a>
        </p>
        <p>
          Mysskeyは
          <a
            href="https://github.com/misskey-dev/misskey"
            target="_blank"
            rel="noopener noreferrer"
          >
            Misskey
          </a>
          のAPIを利用しています
        </p>
        <p>
          現在ログインしているインスタンスは
          <a
            href={"https://" + localStorage.getItem("instanceURL")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {localStorage.getItem("instanceURL")}
          </a>
          です
        </p>
      </div>
    </div>
  );
}
