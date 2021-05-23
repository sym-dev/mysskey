import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../utils/SocketContext";
import { useUserContext } from "../utils/UserContext";
import FollowButton from "./FollowButton";
import noimage from "./bg.png";
import Loading from "./Loading";
import ParseMFM from "../utils/ParseMfm";

export default function Following() {
  const { socketRef } = useSocketContext();
  const { followings, oldestFols, moreFols, updateMoreFols, isLastFols } =
    useUserContext();
  const userName = document.location.pathname.split("@")[1].split("/")[0];
  let userHost = document.location.pathname.split("@")[2];
  userHost = userHost ? userHost.split("/")[0] : undefined;
  useEffect(() => {
    const followingObject = {
      type: "api",
      body: {
        id: "followings",
        endpoint: "users/following",
        data: {
          i: localStorage.getItem("UserToken"),
          username: userName,
          host: userHost,
          limit: 14,
        },
      },
    };
    const socketState = setInterval(() => {
      if (socketRef.current.readyState === 1) {
        socketRef.current.send(JSON.stringify(followingObject));
        clearInterval(socketState);
      }
    }, 100);
  }, [socketRef, userName, userHost]);
  return (
    <>
      <header className="middle-header">
        <h3>フォロー</h3>
      </header>
      {followings && (
        <section className="userRelation">
          {followings.map((user) => (
            <div key={user.followee.id} className="relationContainer">
              <img
                className="banner"
                src={
                  user.followee.bannerUrl ? user.followee.bannerUrl : noimage
                }
                alt="user banner"
                onError={(e) => (e.target.src = noimage)}
              />
              <FollowButton type="mini" userInfo={user.followee} />
              <div className="userContainer">
                <div className="img">
                  <img
                    className="icon"
                    src={user.followee.avatarUrl}
                    alt="user icon"
                    style={{
                      borderColor:
                        user.followee.onlineStatus === "online"
                          ? "#87cefae0"
                          : user.followee.onlineStatus === "active"
                          ? "#ffa500e0"
                          : user.followee.onlineStatus === "offline"
                          ? "#ff6347e0"
                          : "#04002cbb",
                    }}
                  />
                </div>
                <div className="userInfo">
                  <Link
                    to={`/user/@${user.followee.username}${
                      user.followee.host ? `@${user.followee.host}` : ""
                    }`}
                  >
                    {user.followee.name ? (
                      <ParseMFM
                        text={user.followee.name}
                        emojis={user.followee.emojis}
                        type="plain"
                      />
                    ) : (
                      user.followee.username
                    )}
                  </Link>
                  <p>{`@${user.followee.username}${
                    user.followee.host ? `@${user.followee.host}` : ""
                  }`}</p>
                </div>
              </div>
            </div>
          ))}
          {!isLastFols && (
            <button
              className="motto"
              onClick={() => {
                socketRef.current.send(
                  JSON.stringify({
                    type: "api",
                    body: {
                      id: "moreFollowings",
                      endpoint: "users/following",
                      data: {
                        i: localStorage.getItem("UserToken"),
                        username: userName,
                        host: userHost,
                        limit: 14,
                        untilId: oldestFols,
                      },
                    },
                  })
                );
                updateMoreFols(true);
              }}
            >
              {moreFols ? <Loading size="small" /> : "もっと"}
            </button>
          )}
        </section>
      )}
    </>
  );
}
