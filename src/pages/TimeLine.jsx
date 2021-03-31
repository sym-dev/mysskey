import { IoHome } from "react-icons/io5";
import Note from "../components/Note";
import Reactions from "../components/Reactions";
import NoteFooter from "../components/NoteFooter";
import Loading from "../components/Loading";
import { useNotesContext } from "../utils/NotesContext";
import { useSocketContext } from "../utils/SocketContext";

export default function TimeLine() {
  const { notes, oldestNoteId, moreNote, updateMoreNote } = useNotesContext();
  const { socketRef } = useSocketContext();
  const moreNoteObject = {
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
  };
  return (
    <>
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
            <button
              className="motto"
              onClick={() => {
                socketRef.current.send(JSON.stringify(moreNoteObject));
                updateMoreNote(true);
              }}
            >
              {moreNote ? <Loading size="small" /> : "もっと"}
            </button>
          </>
        )}
      </main>
    </>
  );
}
