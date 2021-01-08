require('dotenv').config();
const fetch = require('node-fetch');
const URL = 'https://misskey.io/api/notes/show';

const body = {
  "noteId": "8grh16g2hy"
};

fetch(URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    if (!res.ok) {
      // 200 系以外のレスポンスはエラーとして処理
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  })
  // これがレスポンス本文のテキスト
  .then(text => console.log(text))
  // エラーはここでまとめて処理
  .catch(err => console.error(err));