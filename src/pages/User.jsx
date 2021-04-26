import React, { useState, useEffect } from "react";
import { IoCalendar, IoGolf, IoPin } from "react-icons/io5";
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
    updateUserNotes(false);
    updateIncludeReply(false);
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
    const socketState = setInterval(() => {
      if (socketRef.current.readyState === 1) {
        socketRef.current.send(JSON.stringify(userInfoObject));
        clearInterval(socketState);
      }
    }, 100);
  }, [
    socketRef,
    userName,
    userHost,
    location,
    updateHeaderValue,
    updateUserNotes,
  ]);
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

function UserSection({ data }) {
  // console.log(data);
  return (
    <>
      <div className="userpage">
        <img
          className="banner"
          src={data.bannerUrl ? data.bannerUrl : noimage}
          alt="user banner"
          onError={(e) => (e.target.src = noimage)}
        />
        <div className="user-container">
          <div className="user-profile">
            <img
              className="icon"
              src={data.avatarUrl}
              alt="user icon"
              style={{
                borderColor:
                  data.onlineStatus === "online"
                    ? "#87cefae0"
                    : data.onlineStatus === "active"
                    ? "#ffa500e0"
                    : "#04002cbb",
              }}
            />
            <div>
              <h1 className="username">
                {data.name ? (
                  <ParseMFM
                    text={data.name}
                    emojis={data.emojis}
                    type="plain"
                  />
                ) : (
                  data.username
                )}
              </h1>
              <p className="userid">
                {"@" +
                  data.username +
                  (data.host
                    ? "@" + data.host
                    : "@" + localStorage.getItem("instanceURL"))}
              </p>
              <p className="state">
                ステータス:{" "}
                {data.onlineStatus === "online"
                  ? "オンライン"
                  : data.onlineStatus === "active"
                  ? "アクティブ"
                  : "unknown"}
              </p>
              <div className="desc">
                {data.description ? (
                  <ParseMFM
                    text={data.description}
                    emojis={data.emojis}
                    type="full"
                  />
                ) : (
                  <i>no description provided.</i>
                )}
              </div>
            </div>
          </div>
          <div className="user-info">
            {data.birthday && (
              <>
                <hr />
                <div className="dates">
                  <dt>
                    <IoGolf />
                    誕生日
                  </dt>
                  <dl>{getDate(data.birthday)}</dl>
                </div>
              </>
            )}
            <hr />
            <div className="dates">
              <dt>
                <IoCalendar />
                登録日
              </dt>
              <dl>{getDate(data.createdAt)}</dl>
            </div>
            {data.fields.length > 0 && (
              <>
                <hr />
                <div className="fields">
                  {data.fields.map((data, i) => (
                    <div key={i}>
                      <dt>{data.name}</dt>
                      <dl>
                        {
                          <ParseMFM
                            text={data.value}
                            emojis={data.emojis}
                            type="full"
                          />
                        }
                      </dl>
                    </div>
                  ))}
                </div>
              </>
            )}
            <hr />
            <div className="count">
              <div>
                <p>{data.notesCount}</p>
                <p>ノート</p>
              </div>
              <div>
                <p>{data.followingCount}</p>
                <p>フォロー</p>
              </div>
              <div>
                <p>{data.followersCount}</p>
                <p>フォロワー</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function getDate(d) {
  const date = new Date(d);
  return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay();
}
