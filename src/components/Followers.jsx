import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../utils/SocketContext";
import { useUserContext } from "../utils/UserContext";
import FollowButton from "./FollowButton";
import noimage from "./bg.png";
import Loading from "./Loading";
import ParseMFM from "../utils/ParseMfm";

export default function Followers() {
  const { socketRef } = useSocketContext();
  const { followers, oldestFols, moreFols, updateMoreFols, isLastFols } =
    useUserContext();
  const userName = document.location.pathname.split("@")[1].split("/")[0];
  let userHost = document.location.pathname.split("@")[2];
  userHost = userHost ? userHost.split("/")[0] : undefined;
  useEffect(() => {
    const followerObject = {
      type: "api",
      body: {
        id: "followers",
        endpoint: "users/followers",
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
        socketRef.current.send(JSON.stringify(followerObject));
        clearInterval(socketState);
      }
    }, 100);
  }, [socketRef, userName, userHost]);
  return (
    <>
      <header className="middle-header">
        <h3>フォロワー</h3>
      </header>
      {followers && (
        <section className="userRelation">
          {followers.map((user) => (
            <div key={user.follower.id} className="relationContainer">
              <img
                className="banner"
                src={
                  user.follower.bannerUrl ? user.follower.bannerUrl : noimage
                }
                alt="user banner"
                onError={(e) => (e.target.src = noimage)}
              />
              <FollowButton type="mini" userInfo={user.follower} />
              <div className="userContainer">
                <div className="img">
                  <img
                    className="icon"
                    src={user.follower.avatarUrl}
                    alt="user icon"
                    style={{
                      borderColor:
                        user.follower.onlineStatus === "online"
                          ? "#87cefae0"
                          : user.follower.onlineStatus === "active"
                          ? "#ffa500e0"
                          : user.follower.onlineStatus === "offline"
                          ? "#ff6347e0"
                          : "#04002cbb",
                    }}
                  />
                </div>
                <div className="userInfo">
                  <Link
                    to={`/user/@${user.follower.username}${
                      user.follower.host ? `@${user.follower.host}` : ""
                    }`}
                  >
                    {user.follower.name ? (
                      <ParseMFM
                        text={user.follower.name}
                        emojis={user.follower.emojis}
                        type="plain"
                      />
                    ) : (
                      user.follower.username
                    )}
                  </Link>
                  <p>{`@${user.follower.username}${
                    user.follower.host ? `@${user.follower.host}` : ""
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
                      id: "moreFollowers",
                      endpoint: "users/followers",
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
