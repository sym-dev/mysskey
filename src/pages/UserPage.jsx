import React, { useState, useEffect, useRef } from "react";
import { IoCalendar, IoGolf } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useHeaderContext } from "../utils/HeaderContext";
import { useSocketContext } from "../utils/SocketContext";
import { useUserContext } from "../utils/UserContext";
import ParseMFM from "../utils/ParseMfm";
import FollowButton from "../components/FollowButton";
import Loading from "../components/Loading";
import noimage from "../components/bg.png";

export default function UserSection() {
  const dontEffect = useRef(false);
  const settings = useRef(JSON.parse(localStorage.getItem("settings")));
  const { userInfo, updateUserinfo, updateUserNotes, oldestUserNoteId } =
    useUserContext();
  const { socketRef } = useSocketContext();
  const { updateHeaderValue } = useHeaderContext();
  const [includeReply, updateIncludeReply] = useState(false);
  const location = useLocation();
  const userName = document.location.pathname.split("@")[1].split("/")[0];
  let userHost = document.location.pathname.split("@")[2];
  userHost = userHost ? userHost.split("/")[0] : undefined;
  useEffect(() => {
    dontEffect.current = true;
  }, [oldestUserNoteId, userInfo, includeReply, settings]);
  useEffect(() => {
    updateUserinfo(false);
  }, [userName, userHost, updateUserinfo]);
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
      <section>
        {!userInfo ? (
          <Loading />
        ) : (
          <div className="userpage">
            {userInfo.username !== localStorage.getItem("UserName") && (
              <FollowButton type="default" />
            )}
            <img
              className="banner"
              src={userInfo.bannerUrl ? userInfo.bannerUrl : noimage}
              alt="user banner"
              onError={(e) => (e.target.src = noimage)}
            />
            <div className="user-container">
              <div className="user-profile">
                <img
                  className="icon"
                  src={userInfo.avatarUrl}
                  alt="user icon"
                  style={{
                    borderColor:
                      userInfo.onlineStatus === "online"
                        ? "#87cefae0"
                        : userInfo.onlineStatus === "active"
                        ? "#ffa500e0"
                        : userInfo.onlineStatus === "offline"
                        ? "#ff6347e0"
                        : "#04002cbb",
                  }}
                />
                <div>
                  <h1 className="username">
                    {userInfo.name ? (
                      <ParseMFM
                        text={userInfo.name}
                        emojis={userInfo.emojis}
                        type="plain"
                      />
                    ) : (
                      userInfo.username
                    )}
                  </h1>
                  <p className="userid">
                    {"@" +
                      userInfo.username +
                      (userInfo.host
                        ? "@" + userInfo.host
                        : "@" + localStorage.getItem("instanceURL"))}
                  </p>
                  {userInfo.isBlocked && (
                    <p className="blocked">ブロックされています</p>
                  )}
                  <p className="state">
                    ステータス:{" "}
                    {userInfo.onlineStatus === "online"
                      ? "オンライン"
                      : userInfo.onlineStatus === "active"
                      ? "アクティブ"
                      : userInfo.onlineStatus === "offline"
                      ? "オフライン"
                      : "unknown"}
                  </p>
                  <div className="desc">
                    {userInfo.description ? (
                      <ParseMFM
                        text={userInfo.description}
                        emojis={userInfo.emojis}
                        type="full"
                      />
                    ) : (
                      <i>no description provided.</i>
                    )}
                  </div>
                </div>
              </div>
              <div className="user-info">
                {userInfo.birthday && (
                  <>
                    <hr />
                    <div className="dates">
                      <dt>
                        <IoGolf />
                        誕生日
                      </dt>
                      <dl>{getDate(userInfo.birthday)}</dl>
                    </div>
                  </>
                )}
                <hr />
                <div className="dates">
                  <dt>
                    <IoCalendar />
                    登録日
                  </dt>
                  <dl>{getDate(userInfo.createdAt)}</dl>
                </div>
                {userInfo.fields.length > 0 && (
                  <>
                    <hr />
                    <div className="fields">
                      {userInfo.fields.map((data, i) => (
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
                    <Link
                      to={`/user/@${userName}${userHost ? `@${userHost}` : ""}`}
                    >
                      <p>{userInfo.notesCount}</p>
                      <p>ノート</p>
                    </Link>
                  </div>
                  <div>
                    <Link
                      to={`/user/@${userName}${
                        userHost ? `@${userHost}` : ""
                      }/following`}
                    >
                      <p>{userInfo.followingCount}</p>
                      <p>フォロー</p>
                    </Link>
                  </div>
                  <div>
                    <Link
                      to={`/user/@${userName}${
                        userHost ? `@${userHost}` : ""
                      }/followers`}
                    >
                      <p>{userInfo.followersCount}</p>
                      <p>フォロワー</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function getDate(d) {
  const date = new Date(d);
  return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay();
}
