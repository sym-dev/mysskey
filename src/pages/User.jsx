import { useState, useEffect } from "react";
import { IoPin } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { useHeaderContext } from "../utils/HeaderContext";
import { ImageModalProvider } from "../utils/ModalContext";
import ParseMFM from "../utils/ParseMFM";
import ImageModal from "../components/ImageModal";
import Loading from "../components/Loading";
import Note from "../components/Note";
import noimage from "../components/bg.png";

function User() {
  const [user, update] = useState(null);
  const { updateHeaderValue } = useHeaderContext();
  let location = useLocation();
  let userName = document.location.pathname.split("@")[1];
  let userHost = document.location.pathname.split("@")[2];
  useEffect(() => {
    updateHeaderValue(<>User</>);
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
        update(text);
        console.log(text);
        updateHeaderValue(
          <>
            <img className="icon" src={text.avatarUrl} alt="user icon" />
            {text.name ? (
              <ParseMFM text={text.name} emojis={text.emojis} type="plain" />
            ) : (
              text.username
            )}
          </>
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userName, userHost, location, updateHeaderValue]);
  return (
    <>
      <ImageModalProvider>
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
              <h1 className="username">
                {props.data.name ? (
                  <ParseMFM
                    text={props.data.name}
                    emojis={props.data.emojis}
                    type="plain"
                  />
                ) : (
                  props.data.username
                )}
              </h1>
              <p className="userid">
                {"@" +
                  props.data.username +
                  (props.data.host ? "@" + props.data.host : "")}
              </p>
              <div className="desc">
                {props.data.description ? (
                  <ParseMFM
                    text={props.data.description}
                    emojis={props.data.emojis}
                    type="full"
                  />
                ) : (
                  <i>no description provided.</i>
                )}
              </div>
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
