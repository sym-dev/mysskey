import React, { useState, useEffect, useRef } from "react";
import { IoCalendar, IoGolf, IoPin } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { useHeaderContext } from "../utils/HeaderContext";
import { ImageModalProvider } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useUserContext } from "../utils/UserContext";
import { InView, useInView } from "react-intersection-observer";
import Note from "../components/Note";
import ParseMFM from "../utils/ParseMfm";
import FollowButton from "../components/FollowButton";
import ImageModal from "../components/ImageModal";
import Loading from "../components/Loading";
import Reactions from "../components/Reactions";
import NoteFooter from "../components/NoteFooter";
import noimage from "../components/bg.png";

export default function User() {
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
  });
  const dontEffect = useRef(false);
  const settings = useRef(JSON.parse(localStorage.getItem("settings")));
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
    dontEffect.current = true;
  }, [oldestUserNoteId, userInfo, includeReply, settings]);
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
  useEffect(() => {
    if (settings.current.auto_motto) {
      if (dontEffect.current) {
        dontEffect.current = false;
      } else {
        if (entry && entry.isIntersecting) {
          updateMoreUserNote(true);
          socketRef.current.send(
            JSON.stringify({
              type: "api",
              body: {
                id: "moreUserNotes",
                endpoint: "users/notes",
                data: {
                  i: localStorage.getItem("UserToken"),
                  userId: userInfo.id,
                  includeReplies: includeReply,
                  limit: 15,
                  untilId: oldestUserNoteId,
                },
              },
            })
          );
        }
      }
    }
  }, [
    inView,
    entry,
    oldestUserNoteId,
    socketRef,
    updateMoreUserNote,
    includeReply,
    userInfo,
  ]);
  return (
    <>
      <InView>
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
                    <Reactions data={data} />
                    <NoteFooter data={data} />
                  </div>
                ))}
              </div>
            )}
          </main>
          <section className="userNotes">
            <nav className="noteNav">
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
                    <Reactions data={data} />
                    <NoteFooter data={data} />
                  </div>
                ))}
                <button
                  className="motto"
                  ref={ref}
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
      </InView>
    </>
  );
}

function UserSection({ data }) {
  // console.log(data);
  return (
    <>
      <div className="userpage">
        {data.username !== localStorage.getItem("UserName") && (
          <FollowButton type="default" />
        )}
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
                    : data.onlineStatus === "offline"
                    ? "#ff6347e0"
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
              {data.isBlocked && (
                <p className="blocked">ブロックされています</p>
              )}
              <p className="state">
                ステータス:{" "}
                {data.onlineStatus === "online"
                  ? "オンライン"
                  : data.onlineStatus === "active"
                  ? "アクティブ"
                  : data.onlineStatus === "offline"
                  ? "オフライン"
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
