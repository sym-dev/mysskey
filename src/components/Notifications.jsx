import React, { useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { useSocketContext } from "../utils/SocketContext";
import { useHeaderContext } from "../utils/HeaderContext";
import { useNotificationContext } from "../utils/NotificationContext";
import { getRelativeTime } from "../utils/getRelativeTime";
import Loading from "./Loading";
import parseEmojis from "../utils/parseEmojis";
import {
  IoArrowUndo,
  IoAt,
  IoCheckmarkCircle,
  IoPencil,
  IoPeople,
  IoPersonAdd,
  IoRepeat,
  IoTime,
} from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Notifications() {
  const { updateHeaderValue } = useHeaderContext();
  const {
    notifications,
    oldestNotificationId,
    moreNotification,
    updateMoreNotification,
  } = useNotificationContext();
  const { socketRef } = useSocketContext();
  useEffect(() => {
    updateHeaderValue(
      <>
        <IoNotifications fontSize="1.2em" />
        Notification
      </>
    );
  }, [updateHeaderValue]);
  return (
    <>
      {notifications.length <= 0 ? (
        <Loading />
      ) : (
        <div className="notificationsWrapper">
          {notifications
            .filter((data) => data.type !== "pollVote")
            .map((data) => {
              let link = "";
              let type = "";
              let reply = "";
              let text = "";
              let quote = "";
              let file = "";
              let isNote = true;
              switch (data.type) {
                case "follow":
                  type = <IoPersonAdd fontSize="1.1em" />;
                  text = "フォローされました";
                  isNote = false;
                  break;
                case "mention":
                  link = data.note.id;
                  type = <IoAt fontSize="1.3em" />;
                  text = parseEmojis(data.note.text, data.note.emojis);
                  if (data.note.files.length > 0) {
                    file = "(" + data.note.files.length + "つのファイル)";
                  }
                  break;
                case "reply":
                  link = data.note.id;
                  type = <IoArrowUndo fontSize="1.2em" />;
                  reply = data.note.reply;
                  text = parseEmojis(data.note.text, data.note.emojis);
                  break;
                case "renote":
                  link = data.note.renote.id;
                  type = <IoRepeat className="renote" fontSize="1.3em" />;
                  text = parseEmojis(
                    data.note.renote.text,
                    data.note.renote.emojis
                  );
                  if (data.note.renote.files.length > 0) {
                    file =
                      "(" + data.note.renote.files.length + "つのファイル)";
                  }
                  break;
                case "quote":
                  link = data.note.id;
                  type = <IoPencil className="renote" fontSize="1.2em" />;
                  quote = data.note.renote;
                  text = parseEmojis(data.note.text, data.note.emojis);
                  break;
                case "reaction":
                  link = data.note.id;
                  type = parseEmojis(data.reaction, data.note.emojis);
                  text = parseEmojis(data.note.text, data.note.emojis);
                  if (data.note.files.length > 0) {
                    file = "(" + data.note.files.length + "つのファイル)";
                  }
                  break;
                case "receiveFollowRequest":
                  type = <IoTime fontSize="1.3em" />;
                  text = "フォローリクエストされました";
                  isNote = false;
                  break;
                case "followRequestAccepted":
                  type = <IoCheckmarkCircle fontSize="1.3em" />;
                  text = "フォローリクエストが承認されました";
                  isNote = false;
                  break;
                case "groupInvited":
                  type = <IoPeople fontSize="1.2em" />;
                  text =
                    "グループに招待されました: " + data.invitation.group.name;
                  isNote = false;
                  break;
                case "app":
                  break;
                default:
                  break;
              }
              return (
                <React.Fragment key={data.id}>
                  {reply && (
                    <div className="replyContainer">
                      <img
                        src={reply.user.avatarUrl}
                        alt={reply.user.username}
                      />
                      <div className="replyBody">
                        <div className="replyInfo">
                          <Link
                            to={
                              reply.user.host
                                ? "/user/@" +
                                  reply.user.username +
                                  "@" +
                                  reply.user.host
                                : "/user/@" + reply.user.username
                            }
                            className="username"
                          >
                            {parseEmojis(
                              reply.user.name
                                ? reply.user.name
                                : reply.user.username,
                              reply.user.emojis
                            )}
                          </Link>
                          {isNote ? (
                            <Link
                              to={"/notes/" + reply.id}
                              className="createdAt"
                            >
                              {getRelativeTime(reply.createdAt)}
                            </Link>
                          ) : (
                            <p className="createdAt">
                              {getRelativeTime(reply.createdAt)}
                            </p>
                          )}
                        </div>
                        <div className="replyNoteBody">
                          {parseEmojis(reply.text, reply.emojis)}
                          {reply.files.length > 0 && (
                            <span className="file">{`${reply.files.length}つのファイル`}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="notificationContainer" key={data.id}>
                    <div className="notificationIcon">
                      <img src={data.user.avatarUrl} alt={data.user.username} />
                      <div className="type">
                        <div>{type}</div>
                      </div>
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
                            data.user.name
                              ? data.user.name
                              : data.user.username,
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
                        {file && <span className="file">{file}</span>}
                      </p>
                    </div>
                  </div>
                  {quote && (
                    <div className="quoteContainer">
                      <img
                        src={quote.user.avatarUrl}
                        alt={quote.user.username}
                      />
                      <div className="quoteBody">
                        <div className="quoteInfo">
                          <Link
                            to={
                              quote.user.host
                                ? "/user/@" +
                                  quote.user.username +
                                  "@" +
                                  quote.user.host
                                : "/user/@" + quote.user.username
                            }
                            className="username"
                          >
                            {parseEmojis(
                              quote.user.name
                                ? quote.user.name
                                : quote.user.username,
                              quote.user.emojis
                            )}
                          </Link>
                          {isNote ? (
                            <Link
                              to={"/notes/" + quote.id}
                              className="createdAt"
                            >
                              {getRelativeTime(quote.createdAt)}
                            </Link>
                          ) : (
                            <p className="createdAt">
                              {getRelativeTime(quote.createdAt)}
                            </p>
                          )}
                        </div>
                        <div className="quoteNoteBody">
                          {parseEmojis(quote.text, quote.emojis)}
                          {quote.files.length > 0 && (
                            <span className="file">{`${quote.files.length}つのファイル`}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <hr />
                </React.Fragment>
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
    </>
  );
}
