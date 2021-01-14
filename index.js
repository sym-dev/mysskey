const { v4: uuidv4 } = require("uuid");
const open = require("open");
const fs = require("fs");
require("dotenv").config();
const prompts = require("prompts");
const fetch = require("node-fetch");
const instanceURL = "https://misskey.io/";

const envPath = "./env";

if (!fs.existsSync(envPath) && typeof process.env.UserToken == "undefined") {
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
  open(authUrl);
  const tokenUrl = instanceURL + "api/miauth/" + uuid + "/check";
  (async () => {
    await prompts({
      type: "text",
      name: "value",
      message: "認証後、Enterを押してください。",
    });
  })().then(() => {
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
        fs.writeFile(".env", "UserToken=" + text.token, (err) => {
          if (err) throw err;
          console.log("正常に書き込みが完了しました");
        });
      })
      .catch((err) => console.error(err));
  });
}

(async () => {
  const response = await prompts({
    type: "text",
    name: "noteText",
    message: "何をお考えですか？",
  });
  return response;
})().then((response) => {
  const body = {
    i: process.env.UserToken,
    text: response.noteText,
  };
  fetch(instanceURL + "api/notes/create", {
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
      console.log(text.createdNote.user.name);
      console.log(text.createdNote.text);
    })
    .catch((err) => console.error(err));
});
