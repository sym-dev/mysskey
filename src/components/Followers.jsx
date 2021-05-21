import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocketContext } from "../utils/SocketContext";
import { useUserContext } from "../utils/UserContext";
import FollowButton from "./FollowButton";
import noimage from "./bg.png";

export default function Followers() {
  const { socketRef } = useSocketContext();
  const { followers } = useUserContext();
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
      {followers && (
        <section className="userRelation">
          {followers.map((user) => (
            <div key={user.follower.id}>
              <img
                className="banner"
                src={
                  user.follower.bannerUrl ? user.follower.bannerUrl : noimage
                }
                alt="user banner"
                onError={(e) => (e.target.src = noimage)}
              />
              <div className="relationContainer">
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
                <div>
                  <Link
                    to={`/user/@${user.follower.username}${
                      user.follower.host ? `@${user.follower.host}` : ""
                    }`}
                  >
                    {user.follower.name
                      ? user.follower.name
                      : user.follower.username}
                  </Link>
                  <p>{`@${user.follower.username}${
                    user.follower.host ? `@${user.follower.host}` : ""
                  }`}</p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
