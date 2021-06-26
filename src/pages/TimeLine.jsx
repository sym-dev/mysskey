import { useEffect, useRef } from "react";
import { IoHome, IoGlobeOutline, IoFastFood, IoPizza } from "react-icons/io5";
import { useNotesContext } from "../utils/NotesContext";
import { useSocketContext } from "../utils/SocketContext";
import { InView, useInView } from "react-intersection-observer";
import Note from "../components/Note";
import Reactions from "../components/Reactions";
import NoteFooter from "../components/NoteFooter";
import Loading from "../components/Loading";

export default function TimeLine() {
  const nowTL = useRef(JSON.parse(localStorage.getItem("TimeLine")).stream);
  const tl = {
    local: !JSON.parse(localStorage.getItem("meta")).disableLocalTimeline,
    global: !JSON.parse(localStorage.getItem("meta")).disableGlobalTimeline,
  };
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
  });
  const dontEffect = useRef(false);
  const settings = useRef(JSON.parse(localStorage.getItem("settings")));
  const {
    notes,
    dispatch,
    oldestNoteId,
    moreNote,
    updateMoreNote,
    isLastNote,
  } = useNotesContext();
  const { socketRef } = useSocketContext();
  useEffect(() => {
    dontEffect.current = true;
  }, [oldestNoteId, settings]);
  useEffect(() => {
    if (settings.current.auto_motto) {
      if (dontEffect.current) {
        dontEffect.current = false;
      } else {
        if (entry && entry.isIntersecting) {
          updateMoreNote(true);
          socketRef.current.send(
            JSON.stringify({
              type: "api",
              body: {
                id: "moreNote",
                endpoint: "notes/timeline",
                data: {
                  i: localStorage.getItem("UserToken"),
                  limit: 15,
                  untilId: oldestNoteId,
                },
              },
            })
          );
        }
      }
    }
  }, [inView, entry, socketRef, updateMoreNote, oldestNoteId, settings]);
  return (
    <>
      <InView>
        <header className="middle-header">
          <button
            className={nowTL.current === "homeTimeline" ? "active" : ""}
            onClick={() => {
              changeTL("homeTimeline", socketRef, dispatch, nowTL);
            }}
          >
            <IoHome fontSize="1.5em" className="ion-icon" />
            <h3>Home</h3>
          </button>
          {tl.local && (
            <button
              className={nowTL.current === "localTimeline" ? "active" : ""}
              onClick={() => {
                changeTL("localTimeline", socketRef, dispatch, nowTL);
              }}
            >
              <IoFastFood fontSize="1.5em" className="ion-icon" />
              <h3>Local</h3>
            </button>
          )}
          {tl.local && (
            <button
              className={nowTL.current === "hybridTimeline" ? "active" : ""}
              onClick={() => {
                changeTL("hybridTimeline", socketRef, dispatch, nowTL);
              }}
            >
              <IoPizza fontSize="1.5em" className="ion-icon" />
              <h3>Social</h3>
            </button>
          )}
          {tl.global && (
            <button
              className={nowTL.current === "globalTimeline" ? "active" : ""}
              onClick={() => {
                changeTL("globalTimeline", socketRef, dispatch, nowTL);
              }}
            >
              <IoGlobeOutline fontSize="1.5em" className="ion-icon" />
              <h3>Global</h3>
            </button>
          )}
        </header>
        <main>
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
              {!isLastNote && (
                <button
                  ref={ref}
                  className="motto"
                  onClick={() => {
                    updateMoreNote(true);
                    socketRef.current.send(
                      JSON.stringify({
                        type: "api",
                        body: {
                          id: "moreNote",
                          endpoint: "notes/timeline",
                          data: {
                            i: localStorage.getItem("UserToken"),
                            limit: 15,
                            untilId: oldestNoteId,
                          },
                        },
                      })
                    );
                  }}
                >
                  {moreNote ? <Loading size="small" /> : "もっと"}
                </button>
              )}
            </>
          )}
        </main>
      </InView>
    </>
  );
}

function changeTL(type, socketRef, dispatch, nowTL) {
  let { stream, api } = JSON.parse(localStorage.getItem("TimeLine"));
  if (stream !== type) {
    switch (type) {
      case "homeTimeline":
        nowTL.current = "homeTimeline";
        localStorage.setItem(
          "TimeLine",
          JSON.stringify({
            stream: "homeTimeline",
            api: "timeline",
          })
        );
        stream = "homeTimeline";
        api = "timeline";
        break;
      case "localTimeline":
        nowTL.current = "localTimeline";
        localStorage.setItem(
          "TimeLine",
          JSON.stringify({
            stream: "localTimeline",
            api: "local-timeline",
          })
        );
        stream = "localTimeline";
        api = "local-timeline";
        break;
      case "hybridTimeline":
        nowTL.current = "hybridTimeline";
        localStorage.setItem(
          "TimeLine",
          JSON.stringify({
            stream: "hybridTimeline",
            api: "hybrid-timeline",
          })
        );
        stream = "hybridTimeline";
        api = "hybrid-timeline";
        break;
      case "globalTimeline":
        nowTL.current = "globalTimeline";
        localStorage.setItem(
          "TimeLine",
          JSON.stringify({
            stream: "globalTimeline",
            api: "global-timeline",
          })
        );
        stream = "globalTimeline";
        api = "global-timeline";
        break;
      default:
        break;
    }
    socketRef.current.send(
      JSON.stringify({
        type: "disconnect",
        body: {
          id: "timeline",
        },
      })
    );
    dispatch({
      type: "clearAll",
    });
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
    const timeLineObject = {
      type: "connect",
      body: {
        channel: stream,
        id: "timeline",
      },
    };
    socketRef.current.send(JSON.stringify(initNoteObject));
    socketRef.current.send(JSON.stringify(timeLineObject));
  }
}
