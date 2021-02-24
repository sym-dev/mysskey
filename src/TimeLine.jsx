import React, { useState, useEffect, useRef } from "react";
import { IoHome, IoPencil } from "react-icons/io5";
import Note from "./components/Note";
import NoteFooter from "./components/NoteFooter";
import Loading from "./components/Loading";
import PostModal from "./components/PostModal";
import ImageModal from "./components/ImageModal";
import RenoteModal from "./components/RenoteModal";
import {
  usePostModalContext,
  ImageModalProvider,
  RenoteModalProvider,
} from "./ModalContext";

function TimeLine() {
  const [notes, addNote] = useState([]);
  const [oldestNoteId, updateOldest] = useState();
  const [moreState, updateMore] = useState(false);
  const { postModal, updatePostModal } = usePostModalContext();
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = new WebSocket(
      "wss://" +
        localStorage.getItem("instanceURL") +
        "/streaming?i=" +
        localStorage.getItem("UserToken")
    );
    socketRef.current.onopen = (e) => {
      // console.log("socket opend");
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
      socketRef.current.send(JSON.stringify(initNoteObject));
    };

    socketRef.current.onmessage = (event) => {
      let res = JSON.parse(event.data);
      let data = res.body;
      // console.log("receive anything data");
      // console.log(data);
      switch (res.type) {
        case "api:init":
          // console.log("receive init notes");
          data.res.forEach((note) => {
            addNote((n) => [...n, note]);
            // console.log(note);
          });
          updateOldest(data.res[14].id);
          break;
        case "api:more":
          // console.log("clicked motto");
          updateMore(false);
          data.res.forEach((note) => {
            addNote((n) => [...n, note]);
            // console.log(note);
          });
          updateOldest(data.res[14].id);
          break;
        default:
          break;
      }
      if (data.id === "home") {
        // console.log("receive new note");
        // console.log(data.body);
        addNote((n) => [data.body, ...n]);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error(error);
    };

    return () => {
      socketRef.current.close();
      // console.log("socket closed");
    };
  }, []);
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
        <RenoteModalProvider>
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
                        !data.renoteId
                          ? "general"
                          : data.text || data.files.length
                          ? "quote"
                          : "renote"
                      }
                    />
                    <NoteFooter data={data} socket={socketRef.current} />
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
            <PostModal socket={socketRef.current} />
            <RenoteModal socket={socketRef.current} />
          </ImageModalProvider>
        </RenoteModalProvider>
      </main>
    </>
  );
}

export default TimeLine;
