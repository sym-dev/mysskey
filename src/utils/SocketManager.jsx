import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import { useNotesContext } from "./NotesContext";
import { useNotificationContext } from "../utils/NotificationContext";
import { useUserContext } from "../utils/UserContext";
import { useNoteDetailsContext } from "../utils/NoteDetailsContext";
import { useHeaderContext } from "../utils/HeaderContext";
import ParseMFM from "../utils/ParseMfm";

export default function SocketManager({ children }) {
  const {
    notes,
    dispatch,
    updateOldestNote,
    updateMoreNote,
  } = useNotesContext();
  const {
    notifications,
    updateNotifications,
    updateOldestNotificationId,
    updateMoreNotification,
  } = useNotificationContext();
  const {
    updateUserinfo,
    updateUserNotes,
    updateOldestUserNoteId,
    updateMoreUserNote,
  } = useUserContext();
  const { updateNoteDetails } = useNoteDetailsContext();
  const { socketRef } = useSocketContext();
  const { updateHeaderValue } = useHeaderContext();
  useEffect(() => {
    socketRef.current.onopen = (e) => {
      const initNoteObject = {
        type: "api",
        body: {
          id: "initNote",
          endpoint: "notes/timeline",
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
      const homeTimelineObject = {
        type: "connect",
        body: {
          channel: "homeTimeline",
          id: "home",
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
      socketRef.current.send(JSON.stringify(homeTimelineObject));
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
            case "home":
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
          updateOldestNote(data.res[14].id);
          break;
        case "api:initNotification":
          data.res.forEach((data) => {
            updateNotifications((n) => [...n, data]);
          });
          updateOldestNotificationId(data.res[14].id);
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
          updateOldestNote(data.res[14].id);
          break;
        case "api:moreNotification":
          updateMoreNotification(false);
          data.res.forEach((data) => {
            updateNotifications((n) => [...n, data]);
          });
          updateOldestNotificationId(data.res[14].id);
          break;
        case "api:userInfo":
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
          updateOldestUserNoteId(data.res[14].id);
          break;
        case "api:moreUserNotes":
          updateMoreUserNote(false);
          data.res.forEach((data) => {
            updateUserNotes((n) => [...n, data]);
          });
          updateOldestUserNoteId(data.res[14].id);
          break;
        case "api:noteDetails":
          updateNoteDetails(data.res);
          // console.log(data.res);
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
    updateMoreNotification,
    updateNotifications,
    updateOldestNotificationId,
    updateUserinfo,
    updateUserNotes,
    updateOldestUserNoteId,
    updateMoreUserNote,
    updateNoteDetails,
    updateHeaderValue,
  ]);
  return <>{children}</>;
}
