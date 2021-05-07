import { useEffect } from "react";
import { IoCheckbox, IoClose, IoFish } from "react-icons/io5";
import { useSocketContext } from "../utils/SocketContext";
import { useHeaderContext } from "../utils/HeaderContext";
import { useUserContext } from "../utils/UserContext";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

function Home() {
  const { socketRef } = useSocketContext();
  const { updateHeaderValue } = useHeaderContext();
  const { followRequests, updateFollowRequests } = useUserContext();
  useEffect(() => {
    updateHeaderValue(
      <>
        <IoFish fontSize="1.2em" />
        FollowRequests
      </>
    );
    const followRequestsObject = {
      type: "api",
      body: {
        id: "followRequests",
        endpoint: "following/requests/list",
        data: {
          i: localStorage.getItem("UserToken"),
        },
      },
    };
    const socketState = setInterval(() => {
      if (socketRef.current.readyState === 1) {
        socketRef.current.send(JSON.stringify(followRequestsObject));
        clearInterval(socketState);
      }
    }, 100);
  }, [updateHeaderValue, socketRef]);
  return (
    <div className="followRequests">
      {followRequests ? (
        <>
          {followRequests.length > 0 ? (
            <>
              {followRequests.map((data) => (
                <div key={data.id}>
                  <img src={data.follower.avatarUrl} />
                  <div>
                    <div className="text">
                      <Link
                        to={
                          "/user/@" +
                          data.follower.username +
                          (data.follower.host
                            ? "@" + data.follower.host
                            : "@" + localStorage.getItem("instanceURL"))
                        }
                      >
                        {data.follower.name
                          ? data.follower.name
                          : data.follower.username}
                      </Link>
                      <p className="userid">
                        {"@" +
                          data.follower.username +
                          (data.follower.host
                            ? "@" + data.follower.host
                            : "@" + localStorage.getItem("instanceURL"))}
                      </p>
                    </div>
                    <div className="buttons">
                      <button
                        className="accept"
                        onClick={() => {
                          socketRef.current.send(
                            JSON.stringify({
                              type: "api",
                              body: {
                                id: "acceptFollowRequests",
                                endpoint: "following/requests/accept",
                                data: {
                                  i: localStorage.getItem("UserToken"),
                                  userId: data.follower.id,
                                },
                              },
                            })
                          );
                          updateFollowRequests(
                            followRequests.filter((f) => f.id !== data.id)
                          );
                        }}
                      >
                        <IoCheckbox fontSize="1.3em" />
                      </button>
                      <button
                        className="deny"
                        onClick={() => {
                          socketRef.current.send(
                            JSON.stringify({
                              type: "api",
                              body: {
                                id: "cancelFollowRequests",
                                endpoint: "following/requests/cancel",
                                data: {
                                  i: localStorage.getItem("UserToken"),
                                  userId: data.follower.id,
                                },
                              },
                            })
                          );
                          updateFollowRequests(
                            followRequests.filter((f) => f.id !== data.id)
                          );
                        }}
                      >
                        <IoClose fontSize="1.3em" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            "リクエストはありません。"
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Home;
