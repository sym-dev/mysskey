import React, { useEffect } from "react";
import { useNotesContext } from "./NotesContext";
import { useNotificationContext } from "../utils/NotificationContext";
import { useSocketContext } from "./SocketContext";

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
  const { socketRef } = useSocketContext();
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
      socketRef.current.send(JSON.stringify(homeTimelineObject));
      socketRef.current.send(JSON.stringify(notificationObject));
      if (notes.length <= 0) {
        socketRef.current.send(JSON.stringify(initNoteObject));
      }
      if (notifications.length <= 0) {
        socketRef.current.send(JSON.stringify(initNotificationObject));
      }
    };
  }, [notes, notifications, socketRef]);
  useEffect(() => {
    socketRef.current.onmessage = (event) => {
      let res = JSON.parse(event.data);
      let data = res.body;
      // console.log("receive anything data");
      // console.log(res);
      switch (res.type) {
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
  ]);
  return <>{children}</>;
}
