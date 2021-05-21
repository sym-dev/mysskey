import { useEffect, useRef } from "react";
import { IoHome } from "react-icons/io5";
import { useNotesContext } from "../utils/NotesContext";
import { useSocketContext } from "../utils/SocketContext";
import { InView, useInView } from "react-intersection-observer";
import Note from "../components/Note";
import Reactions from "../components/Reactions";
import NoteFooter from "../components/NoteFooter";
import Loading from "../components/Loading";

export default function TimeLine() {
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
  });
  const dontEffect = useRef(false);
  const settings = useRef(JSON.parse(localStorage.getItem("settings")));
  const { notes, oldestNoteId, moreNote, updateMoreNote, isLastNote } =
    useNotesContext();
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
          <IoHome fontSize="1.5em" className="ion-icon" />
          <h3>Home</h3>
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
