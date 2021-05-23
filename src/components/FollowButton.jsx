import { IoAdd, IoRemove, IoSend } from "react-icons/io5";
import { useSocketContext } from "../utils/SocketContext";

export default function FollowButton(props) {
  const { socketRef } = useSocketContext();
  const userInfo = props.userInfo;
  const type = props.type ? props.type : "default";
  return (
    <div className={`followButton ${type}`}>
      {userInfo.hasPendingFollowRequestFromYou ? (
        <div
          className="active"
          fontSize="1.5em"
          title="フォロー申請を取り消す"
          onClick={() => {
            socketRef.current.send(
              JSON.stringify({
                type: "api",
                body: {
                  id: "followingUpdate",
                  endpoint: "following/requests/cancel",
                  data: {
                    i: localStorage.getItem("UserToken"),
                    userId: userInfo.id,
                  },
                },
              })
            );
          }}
        >
          <IoSend />
          <p>フォロー申請中</p>
        </div>
      ) : userInfo.isLocked && !userInfo.isFollowing ? (
        <div
          className="inactive"
          fontSize="1.5em"
          title="フォロー申請"
          disabled={userInfo.isBlocked}
          onClick={() => {
            if (!userInfo.isBlocked) {
              socketRef.current.send(
                JSON.stringify({
                  type: "api",
                  body: {
                    id: "followingUpdate",
                    endpoint: "following/create",
                    data: {
                      i: localStorage.getItem("UserToken"),
                      userId: userInfo.id,
                    },
                  },
                })
              );
            }
          }}
        >
          <IoSend />
          <p>フォロー申請</p>
        </div>
      ) : userInfo.isFollowing ? (
        <div
          className="active"
          fontSize="1.5em"
          title="フォロー解除"
          onClick={() => {
            socketRef.current.send(
              JSON.stringify({
                type: "api",
                body: {
                  id: "followingUpdate",
                  endpoint: "following/delete",
                  data: {
                    i: localStorage.getItem("UserToken"),
                    userId: userInfo.id,
                  },
                },
              })
            );
          }}
        >
          <IoRemove />
          <p>フォロー解除</p>
        </div>
      ) : (
        <div
          className="inactive"
          fontSize="1.5em"
          title="フォロー"
          disabled={userInfo.isBlocked}
          onClick={() => {
            if (!userInfo.isBlocked) {
              socketRef.current.send(
                JSON.stringify({
                  type: "api",
                  body: {
                    id: "followingUpdate",
                    endpoint: "following/create",
                    data: {
                      i: localStorage.getItem("UserToken"),
                      userId: userInfo.id,
                    },
                  },
                })
              );
            }
          }}
        >
          <IoAdd />
          <p>フォロー</p>
        </div>
      )}
    </div>
  );
}
