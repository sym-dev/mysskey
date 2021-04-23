import { useState, useEffect } from "react";
import { IoPin } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { useHeaderContext } from "../utils/HeaderContext";
import { ImageModalProvider } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useUserContext } from "../utils/UserContext";
import Note from "../components/Note";
import ParseMFM from "../utils/ParseMfm";
import ImageModal from "../components/ImageModal";
import Loading from "../components/Loading";
import noimage from "../components/bg.png";

export default function User() {
  const {
    userInfo,
    userNotes,
    updateUserNotes,
    oldestUserNoteId,
    moreUserNote,
    updateMoreUserNote,
  } = useUserContext();
  const { socketRef } = useSocketContext();
  const { updateHeaderValue } = useHeaderContext();
  const [includeReply, updateIncludeReply] = useState(false);
  let location = useLocation();
  let userName = document.location.pathname.split("@")[1];
  let userHost = document.location.pathname.split("@")[2];
  useEffect(() => {
    updateHeaderValue(<>User</>);
    const userInfoObject = {
      type: "api",
      body: {
        id: "userInfo",
        endpoint: "users/show",
        data: {
          i: localStorage.getItem("UserToken"),
          username: userName,
          host: userHost,
        },
      },
    };
    socketRef.current.send(JSON.stringify(userInfoObject));
  }, [socketRef, userName, userHost, location, updateHeaderValue]);
  return (
    <>
      <ImageModalProvider>
        <section>
          {!userInfo ? <Loading /> : <UserSection data={userInfo} />}
        </section>
        <main>
          {userInfo && userInfo.pinnedNotes.length > 0 && (
            <div className="pinned-posts">
              <p>
                <IoPin fontSize="1.2em" />
                ピン止めされた投稿
              </p>
              {userInfo.pinnedNotes.map((data) => (
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
          )}
        </main>
        <section className="userNotes">
          <nav>
            <ul>
              <li
                className={!includeReply ? "active" : ""}
                onClick={() => {
                  if (includeReply) {
                    updateUserNotes(false);
                    updateIncludeReply(false);
                    const userNoteObject = {
                      type: "api",
                      body: {
                        id: "userNotes",
                        endpoint: "users/notes",
                        data: {
                          i: localStorage.getItem("UserToken"),
                          userId: userInfo.id,
                          includeReplies: false,
                          limit: 15,
                        },
                      },
                    };
                    socketRef.current.send(JSON.stringify(userNoteObject));
                  }
                }}
              >
                投稿
              </li>
              <li
                className={includeReply ? "active" : ""}
                onClick={() => {
                  if (!includeReply) {
                    updateUserNotes(false);
                    updateIncludeReply(true);
                    const userNoteObject = {
                      type: "api",
                      body: {
                        id: "userNotes",
                        endpoint: "users/notes",
                        data: {
                          i: localStorage.getItem("UserToken"),
                          userId: userInfo.id,
                          includeReplies: true,
                          limit: 15,
                        },
                      },
                    };
                    socketRef.current.send(JSON.stringify(userNoteObject));
                  }
                }}
              >
                投稿と返信
              </li>
            </ul>
          </nav>
          {userNotes && (
            <main>
              {userNotes.map((data) => (
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
              <button
                className="motto"
                onClick={() => {
                  socketRef.current.send(
                    JSON.stringify({
                      type: "api",
                      body: {
                        id: "moreUserNotes",
                        endpoint: "users/notes",
                        data: {
                          i: localStorage.getItem("UserToken"),
                          userId: userInfo.id,
                          includeReplies: false,
                          limit: 15,
                          untilId: oldestUserNoteId,
                        },
                      },
                    })
                  );
                  updateMoreUserNote(true);
                }}
              >
                {moreUserNote ? <Loading size="small" /> : "もっと"}
              </button>
            </main>
          )}
        </section>
        <ImageModal />
      </ImageModalProvider>
    </>
  );
}

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
