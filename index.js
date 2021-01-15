const {
  v4: uuidv4
} = require("uuid");
const open = require("open");
const fs = require("fs");
const prompts = require("prompts");
const fetch = require("node-fetch");
const {
  exit
} = require("process");

const envPath = "./env";
const instanceURL = "https://misskey.io/";

function getToken() {
  return new Promise((resolve, reject) => {
    require("dotenv").config();
    if (fs.existsSync(envPath) || typeof process.env.UserToken == "undefined") {
      // .envが存在しないか、UserTokenがundefinedの時にトークンを取得する
      const uuid = uuidv4();
      const name = "MYSSKEY";
      const authUrl =
        instanceURL +
        "miauth/" +
        uuid +
        "?" +
        "name=" +
        name +
        "&permission=read:account,write:account,write:notes";
      // permissionは https://misskey.io/api-doc で参照可。とりあえずこれだけ
      open(authUrl); //既定のブラウザーで開く
      const tokenUrl = instanceURL + "api/miauth/" + uuid + "/check";
      (async () => {
        await prompts({
          type: "text",
          name: "value",
          message: "認証後、Enterを押してください。",
        }); // 入力を待つ
      })().then(() => {
        fetch(tokenUrl, { // node-fetchでPOSTする
            method: "POST",
          })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`${res.status} ${res.statusText}`);
            }
            return res.json();
          })
          .then((text) => {
            if (text.token != undefined) {
              fs.writeFile(".env", "UserToken=" + text.token, (err) => { // ファイル書き込み
                if (err) throw err;
                console.log("トークンを取得しました。");
                resolve();
              });
            }
          })
          .catch((err) => {
            console.error(err);
            exit(1);
          });
      });
    } else //すでにトークンが存在する時
      resolve();
  })
}

(async () => {
  await getToken(); // getToken()の完了を待つ
  const response = await prompts({
    type: "text",
    name: "noteText",
    message: "何をお考えですか？",
  }); //本文を入力する
  return response;
})().then((response) => {
  require("dotenv").config();
  const body = {
    i: process.env.UserToken,
    text: response.noteText,
  };
  fetch(instanceURL + "api/notes/create", { // https://misskey.io/api-doc#operation/notes/create
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    })
    .then((text) => {
      console.log("post succeed!");
      console.log('\u001b[36m' +
        text.createdNote.user.name + '\u001b[0m');
      console.log(text.createdNote.text);
    })
    .catch((err) => console.error(err));
});