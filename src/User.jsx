import { useState, useEffect } from "react";
import { IoPin } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { ImageModalProvider } from "./utils/ModalContext";
import ImageModal from "./components/ImageModal";
import Loading from "./components/Loading";
import Note from "./components/Note";
import noimage from "./components/bg.png";
import parseEmojis from "./utils/parseEmojis";
import parseURL from "./utils/parseURL";
import parseMFM from "./utils/parseMFM";

function User() {
  const [user, update] = useState(null);
  let location = useLocation();
  let userName = document.location.pathname.split("@")[1];
  let userHost = document.location.pathname.split("@")[2];
  useEffect(() => {
    const userURL =
      "https://" + localStorage.getItem("instanceURL") + "/api/users/show";
    const body = {
      i: localStorage.getItem("UserToken"),
      username: userName,
      host: userHost,
    };
    fetch(userURL, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((text) => {
        // console.log(text);
        update(text);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userName, userHost, location]);
  return (
    <>
      <ImageModalProvider>
        <header className="middle-header">
          <h3>{userName}</h3>
        </header>
        <section>
          {user === null ? <Loading /> : <UserSection data={user} />}
        </section>
        <main>
          {user === null ? (
            <></>
          ) : user.pinnedNotes.length > 0 ? (
            <div className="pinned-posts">
              <p>
                <IoPin fontSize="1.2em" />
                ピン止めされた投稿
              </p>
              {user.pinnedNotes.map((data) => (
                <div key={data.id} className="note">
                  <Note
                    data={data}
                    depth={0}
                    type={
                      data.renoteId && !data.text
                        ? "renote"
                        : data.renoteId
                        ? "quote"
                        : data.replyId
                        ? "reply"
                        : "generall"
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </main>
        <ImageModal />
      </ImageModalProvider>
    </>
  );
}

export default User;

function UserSection(props) {
  // console.log(props.data);
  return (
    <>
      <div className="userpage">
        <img
          className="banner"
          src={props.data.bannerUrl ? props.data.bannerUrl : noimage}
          alt="user banner"
          onError={(e) => (e.target.src = noimage)}
        />
        <div className="user-container">
          <img className="icon" src={props.data.avatarUrl} alt="user icon" />
          <div>
            <div>
              <h1>{props.data.name ? props.data.name : props.data.username}</h1>
              <p className="desc">
                {props.data.description ? (
                  parseEmojis(
                    parseURL(parseMFM(props.data.description)),
                    props.data.emojis
                  )
                ) : (
                  <i>no description provided.</i>
                )}
              </p>
            </div>
            <div className="user-info">
              <div>
                <p>{props.data.notesCount}</p>
                <p>ノート</p>
              </div>
              <div>
                <p>{props.data.followingCount}</p>
                <p>フォロー</p>
              </div>
              <div>
                <p>{props.data.followersCount}</p>
                <p>フォロワー</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
