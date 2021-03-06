import React, { useState, useEffect } from "react";
import { IoHome, IoPencil } from "react-icons/io5";
import Note from "./components/Note";
import Reactions from "./components/Reactions";
import NoteFooter from "./components/NoteFooter";
import Loading from "./components/Loading";
import PostModal from "./components/PostModal";
import ImageModal from "./components/ImageModal";
import { usePostModalContext, ImageModalProvider } from "./utils/ModalContext";
import { useNotesContext } from "./utils/NotesContext";
import { useSocketContext } from "./utils/SocketContext";

export default function TimeLine() {
  const { notes, dispatch } = useNotesContext();
  const { postModal, updatePostModal } = usePostModalContext();
  const [oldestNoteId, updateOldest] = useState("");
  const [moreState, updateMore] = useState(false);
  const { socketRef } = useSocketContext();
  useEffect(() => {
    socketRef.current.onopen = (e) => {
      const initNoteObject = {
        type: "api",
        body: {
          id: "init",
          endpoint: "notes/timeline",
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
      socketRef.current.send(JSON.stringify(homeTimelineObject));
      if (notes.length <= 0) {
        socketRef.current.send(JSON.stringify(initNoteObject));
      }
      // console.log("socket opend");
    };
  }, [notes, socketRef]);
  useEffect(() => {
    socketRef.current.onmessage = (event) => {
      let res = JSON.parse(event.data);
      let data = res.body;
      // console.log("receive anything data");
      // console.log(data);
      switch (res.type) {
        case "api:init":
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
          updateOldest(data.res[14].id);
          break;
        case "api:more":
          // console.log("clicked motto");
          updateMore(false);
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
          updateOldest(data.res[14].id);
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
        default:
          break;
      }
      if (data.id === "home") {
        // console.log("receive new note");
        // console.log(data.body);
        // console.log(data);
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
      }
    };
  }, [dispatch, socketRef]);
  useEffect(() => {
    document.addEventListener(
      "keyup",
      (e) => {
        if (!postModal && e.key === "n") {
          document.removeEventListener("keyup", () => {});
          // updatePostForm(true);
          updatePostModal(true);
        }
      },
      false
    );

    return () => {
      document.removeEventListener("keyup", () => {});
    };
  }, [postModal, updatePostModal]);
  const moreNoteObject = {
    type: "api",
    body: {
      id: "more",
      endpoint: "notes/timeline",
      data: {
        i: localStorage.getItem("UserToken"),
        limit: 15,
        untilId: oldestNoteId,
      },
    },
  };
  return (
    <>
      <header className="middle-header">
        <IoHome fontSize="1.5em" className="ion-icon" />
        <h3>Home</h3>
      </header>
      <button
        className="post-button"
        onClick={() => {
          document.removeEventListener("keyup", () => {});
          updatePostModal(true);
        }}
      >
        <IoPencil fontSize="2em" />
      </button>
      <main>
        <ImageModalProvider>
          {notes.length <= 0 ? (
            <Loading />
          ) : (
            <>
              {notes.map((data) => (
                <div key={data.id} className="note">
                  <Note
                    data={data}
                    socket={socketRef.current}
                    depth={0}
                    type={
                      data.renoteId && !data.text
                        ? "renote"
                        : data.renoteId
                        ? "quote"
                        : data.replyId
                        ? "reply"
                        : "generall"
                    }
                  />
                  <Reactions data={data} />
                  <NoteFooter data={data} />
                </div>
              ))}
              <button
                className="motto"
                onClick={() => {
                  socketRef.current.send(JSON.stringify(moreNoteObject));
                  updateMore(true);
                }}
              >
                {moreState ? <Loading size="small" /> : "もっと"}
              </button>
            </>
          )}
          <ImageModal />
          <PostModal />
        </ImageModalProvider>
      </main>
    </>
  );
}
