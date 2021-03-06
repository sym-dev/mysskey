import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import { useNotesContext } from "./NotesContext";
import { useNotificationContext } from "../utils/NotificationContext";
import { useUserContext } from "../utils/UserContext";
import { useNoteDetailsContext } from "../utils/NoteDetailsContext";
import { useHeaderContext } from "../utils/HeaderContext";
import ParseMFM from "../utils/ParseMfm";

export default function SocketManager({ children }) {
  const { notes, dispatch, updateOldestNote, updateMoreNote, updateLastNote } =
    useNotesContext();
  const {
    notifications,
    updateNotifications,
    updateOldestNotificationId,
    updateMoreNotification,
    updateLastNotification,
  } = useNotificationContext();
  const {
    updateUserinfo,
    updateUserNotes,
    updateOldestUserNoteId,
    updateMoreUserNote,
    updateLastUserNote,
    updateFollowers,
    updateFollowings,
    updateOldefsFols,
    updateMoreFols,
    updateLastFols,
    updateFollowRequests,
  } = useUserContext();
  const { updateNoteDetails, updateNoteConversation, updateNoteChildren } =
    useNoteDetailsContext();
  const { socketRef } = useSocketContext();
  const { updateHeaderValue } = useHeaderContext();
  useEffect(() => {
    socketRef.current.onopen = (e) => {
      const { stream, api } = JSON.parse(localStorage.getItem("TimeLine"));
      const initNoteObject = {
        type: "api",
        body: {
          id: "initNote",
          endpoint: "notes/" + api,
          data: {
            i: localStorage.getItem("UserToken"),
            limit: 15,
          },
        },
      };
      const initNotificationObject = {
        type: "api",
        body: {
          id: "initNotification",
          endpoint: "i/notifications",
          data: {
            i: localStorage.getItem("UserToken"),
            limit: 15,
          },
        },
      };
      const timeLineObject = {
        type: "connect",
        body: {
          channel: stream,
          id: "timeline",
        },
      };
      const notificationObject = {
        type: "connect",
        body: {
          channel: "main",
          id: "notification",
        },
      };
      if (notes.length <= 0) {
        socketRef.current.send(JSON.stringify(initNoteObject));
      }
      if (notifications.length <= 0) {
        socketRef.current.send(JSON.stringify(initNotificationObject));
      }
      socketRef.current.send(JSON.stringify(timeLineObject));
      socketRef.current.send(JSON.stringify(notificationObject));
    };
  }, [notes, notifications, socketRef]);
  useEffect(() => {
    socketRef.current.onmessage = (event) => {
      let res = JSON.parse(event.data);
      let data = res.body;
      // console.log("receive anything data");
      // console.log(res);
      switch (res.type) {
        case "channel":
          switch (data.id) {
            case "timeline":
              // console.log("receive new note");
              dispatch({
                type: "addUpper",
                payload: data.body,
              });
              socketRef.current.send(
                JSON.stringify({
                  type: "subNote",
                  body: {
                    id: data.body.id,
                  },
                })
              );
              break;
            case "notification":
              switch (data.type) {
                case "notification":
                  updateNotifications((n) => [data.body, ...n]);
                  break;
                default:
                  break;
              }
              break;
            default:
              break;
          }
          break;
        case "noteUpdated":
          // console.log(data);
          switch (data.type) {
            case "reacted":
              dispatch({
                type: "updateEmoji",
                payload: data,
              });
              break;
            case "unreacted":
              dispatch({
                type: "deleteEmoji",
                payload: data,
              });
              break;
            case "deleted":
              dispatch({
                type: "remove",
                payload: data,
              });
              break;
            default:
              break;
          }
          break;
        case "api:initNote":
          // console.log("receive init notes");
          data.res.forEach((note) => {
            dispatch({
              type: "addLower",
              payload: note,
            });
            socketRef.current.send(
              JSON.stringify({
                type: "subNote",
                body: {
                  id: note.id,
                },
              })
            );
            // console.log(note);
          });
          if (data.res.length - 1 < 14) {
            updateLastNote(true);
          }
          if (data.res.length > 0) {
            updateOldestNote(
              data.res[data.res.length - 1 < 14 ? data.res.length - 1 : 14].id
            );
          }
          break;
        case "api:initNotification":
          data.res.forEach((data) => {
            updateNotifications((n) => [...n, data]);
          });
          if (data.res.length - 1 < 14) {
            updateLastNotification(true);
          }
          if (data.res.length > 0) {
            updateOldestNotificationId(
              data.res[data.res.length - 1 < 14 ? data.res.length - 1 : 14].id
            );
          }
          break;
        case "api:moreNote":
          // console.log("clicked motto");
          updateMoreNote(false);
          data.res.forEach((note) => {
            dispatch({
              type: "addLower",
              payload: note,
            });
            socketRef.current.send(
              JSON.stringify({
                type: "subNote",
                body: {
                  id: note.id,
                },
              })
            );
            // console.log(note);
          });
          if (data.res.length - 1 < 14) {
            updateLastNote(true);
          }
          updateOldestNote(
            data.res[data.res.length - 1 < 14 ? data.res.length - 1 : 14].id
          );
          break;
        case "api:moreNotification":
          updateMoreNotification(false);
          data.res.forEach((data) => {
            updateNotifications((n) => [...n, data]);
          });
          if (data.res.length - 1 < 14) {
            updateLastNotification(true);
          }
          updateOldestNotificationId(
            data.res[data.res.length - 1 < 14 ? data.res.length - 1 : 14].id
          );
          break;
        case "api:userInfo":
          // console.log(data);
          updateUserinfo(data.res);
          updateHeaderValue(
            <>
              <img
                className="icon"
                src={data.res.avatarUrl}
                alt="user icon"
                style={{
                  borderColor:
                    data.res.onlineStatus === "online"
                      ? "#87cefae0"
                      : data.res.onlineStatus === "active"
                      ? "#ffa500e0"
                      : data.onlineStatus === "offline"
                      ? "#ff6347e0"
                      : "#04002cbb",
                }}
              />
              {data.res.name ? (
                <ParseMFM
                  text={data.res.name}
                  emojis={data.res.emojis}
                  type="plain"
                />
              ) : (
                data.res.username
              )}
            </>
          );
          const userNoteObject = {
            type: "api",
            body: {
              id: "userNotes",
              endpoint: "users/notes",
              data: {
                i: localStorage.getItem("UserToken"),
                userId: data.res.id,
                includeReplies: false,
                limit: 15,
              },
            },
          };
          socketRef.current.send(JSON.stringify(userNoteObject));
          break;
        case "api:userNotes":
          updateUserNotes(data.res);
          if (data.res.length - 1 < 14) {
            updateLastUserNote(true);
          }
          updateOldestUserNoteId(
            data.res[data.res.length - 1 < 14 ? data.res.length - 1 : 14].id
          );
          break;
        case "api:moreUserNotes":
          updateMoreUserNote(false);
          // console.log(data.res);
          data.res.forEach((data) => {
            updateUserNotes((n) => [...n, data]);
          });
          if (data.res.length - 1 < 14) {
            updateLastUserNote(true);
          }
          updateOldestUserNoteId(
            data.res[data.res.length - 1 < 14 ? data.res.length - 1 : 14].id
          );
          break;
        case "api:followRequests":
          // console.log(data);
          updateFollowRequests(data.res);
          break;
        case "api:noteDetails":
          updateNoteDetails(data.res);
          // console.log(data.res);
          break;
        case "api:noteConversation":
          updateNoteConversation(data.res.reverse());
          break;
        case "api:noteChildren":
          updateNoteChildren(data.res);
          break;
        case "api:followingUpdate":
          socketRef.current.send(
            JSON.stringify({
              type: "api",
              body: {
                id: "userInfo",
                endpoint: "users/show",
                data: {
                  i: localStorage.getItem("UserToken"),
                  username: data.res.username,
                  host: data.res.host,
                },
              },
            })
          );
          break;
        case "api:followers":
          updateFollowers(data.res);
          if (data.res.length - 1 < 13) {
            updateLastFols(true);
          }
          updateOldefsFols(
            data.res[data.res.length - 1 < 13 ? data.res.length - 1 : 13].id
          );
          // console.log(data.res);
          break;
        case "api:followings":
          updateFollowings(data.res);
          if (data.res.length - 1 < 13) {
            updateLastFols(true);
          }
          updateOldefsFols(
            data.res[data.res.length - 1 < 13 ? data.res.length - 1 : 13].id
          );
          break;
        case "api:moreFollowers":
          updateMoreFols(false);
          data.res.forEach((data) => {
            updateFollowers((n) => [...n, data]);
          });
          if (data.res.length - 1 < 13) {
            updateLastFols(true);
          }
          updateOldefsFols(
            data.res[data.res.length - 1 < 13 ? data.res.length - 1 : 13].id
          );
          break;
        case "api:moreFollowings":
          updateMoreFols(false);
          data.res.forEach((data) => {
            updateFollowings((n) => [...n, data]);
          });
          if (data.res.length - 1 < 13) {
            updateLastFols(true);
          }
          updateOldefsFols(
            data.res[data.res.length - 1 < 13 ? data.res.length - 1 : 13].id
          );
          break;
        default:
          break;
      }
    };
  }, [
    socketRef,
    dispatch,
    updateMoreNote,
    updateOldestNote,
    updateLastNote,
    updateMoreNotification,
    updateNotifications,
    updateOldestNotificationId,
    updateLastNotification,
    updateUserinfo,
    updateUserNotes,
    updateLastUserNote,
    updateFollowRequests,
    updateFollowers,
    updateFollowings,
    updateMoreFols,
    updateLastFols,
    updateOldefsFols,
    updateOldestUserNoteId,
    updateMoreUserNote,
    updateNoteDetails,
    updateNoteConversation,
    updateNoteChildren,
    updateHeaderValue,
  ]);
  return <>{children}</>;
}
