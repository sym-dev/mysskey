import { useNotificationContext } from "../utils/NotificationContext";
import { useSocketContext } from "../utils/SocketContext";
import { getRelativeTime } from "../utils/getRelativeTime";
import Loading from "../components/Loading";
import parseEmojis from "../utils/parseEmojis";
import { IoAt, IoPersonAdd, IoRepeat, IoTime } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function RightBar() {
  const {
    notifications,
    oldestNotificationId,
    moreNotification,
    updateMoreNotification,
  } = useNotificationContext();
  const { socketRef } = useSocketContext();
  return (
    <div className="side" id="right">
      <header>通知</header>
      {notifications.length <= 0 ? (
        <Loading />
      ) : (
        <div className="notificationWrapper">
          {notifications.map((data) => {
            let link = "";
            let type = "";
            let text = "";
            let file = "";
            let isNote = true;
            switch (data.type) {
              case "reaction":
                link = data.note.id;
                type = parseEmojis(data.reaction, data.note.emojis);
                text = parseEmojis(data.note.text, data.note.emojis);
                if (data.note.files.length > 0) {
                  file = "(" + data.note.files.length + "つのファイル)";
                }
                break;
              case "renote":
                link = data.note.renote.id;
                type = <IoRepeat className="renote" fontSize="1.3em" />;
                text = parseEmojis(
                  data.note.renote.text,
                  data.note.renote.emojis
                );
                if (data.note.renote.files.length > 0) {
                  file = "(" + data.note.renote.files.length + "つのファイル)";
                }
                break;
              case "mention":
                link = data.note.id;
                type = <IoAt fontSize="1.3em" />;
                text = parseEmojis(data.note.text, data.note.emojis);
                if (data.note.files.length > 0) {
                  file = "(" + data.note.files.length + "つのファイル)";
                }
                break;
              case "follow":
                type = <IoPersonAdd className="follow" fontSize="1em" />;
                text = "フォローされました";
                isNote = false;
                break;
              case "receiveFollowRequest":
                type = <IoTime fontSize="1.3em" />;
                text = "フォローリクエストされました";
                isNote = false;
                break;
              default:
                break;
            }
            return (
              <div className="notificationContainer" key={data.id}>
                <div className="notificationIcon">
                  <img src={data.user.avatarUrl} alt={data.user.username} />
                  <div className="type">{type}</div>
                </div>
                <div className="notificationBody">
                  <div className="notificationNoteInfo">
                    <Link
                      to={
                        data.user.host
                          ? "/user/@" +
                            data.user.username +
                            "@" +
                            data.user.host
                          : "/user/@" + data.user.username
                      }
                      className="username"
                    >
                      {parseEmojis(
                        data.user.name ? data.user.name : data.user.username,
                        data.user.emojis
                      )}
                    </Link>
                    {isNote ? (
                      <Link to={"/notes/" + link} className="createdAt">
                        {getRelativeTime(data.createdAt)}
                      </Link>
                    ) : (
                      <p className="createdAt">
                        {getRelativeTime(data.createdAt)}
                      </p>
                    )}
                  </div>
                  <p className="notificationNoteBody">
                    {text}
                    <span className="file">{file}</span>
                  </p>
                </div>
              </div>
            );
          })}
          <button
            className="motto"
            onClick={() => {
              socketRef.current.send(
                JSON.stringify({
                  type: "api",
                  body: {
                    id: "moreNotification",
                    endpoint: "i/notifications",
                    data: {
                      i: localStorage.getItem("UserToken"),
                      limit: 15,
                      untilId: oldestNotificationId,
                    },
                  },
                })
              );
              updateMoreNotification(true);
            }}
          >
            {moreNotification ? <Loading size="small" /> : "もっと"}
          </button>
        </div>
      )}
    </div>
  );
}
