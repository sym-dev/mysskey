import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoDocumentText } from "react-icons/io5";
import { useHeaderContext } from "../utils/HeaderContext";
import { ImageModalProvider } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useNoteDetailsContext } from "../utils/NoteDetailsContext";
import ImageModal from "../components/ImageModal";
import Loading from "../components/Loading";
import Note from "../components/Note";

function Notes() {
  let noteId = document.location.pathname.split("/")[2];
  let location = useLocation();
  const { updateHeaderValue } = useHeaderContext();
  const { socketRef } = useSocketContext();
  const { noteDetails } = useNoteDetailsContext();
  useEffect(() => {
    updateHeaderValue(
      <>
        <IoDocumentText fontSize="1.2em" />
        Note
      </>
    );
    const noteDetailsObject = {
      type: "api",
      body: {
        id: "noteDetails",
        endpoint: "notes/show",
        data: {
          i: localStorage.getItem("UserToken"),
          noteId: noteId,
        },
      },
    };
    socketRef.current.send(JSON.stringify(noteDetailsObject));
  }, [noteId, location, updateHeaderValue, socketRef]);
  return (
    <>
      <ImageModalProvider>
        <main>
          {noteDetails === false ? (
            <Loading />
          ) : (
            <div key={noteDetails.id} className="note">
              <Note
                data={noteDetails}
                depth={0}
                type={
                  !noteDetails.renoteId
                    ? "general"
                    : noteDetails.text || noteDetails.files.length
                    ? "quote"
                    : "renote"
                }
              />
            </div>
          )}
        </main>
        <ImageModal />
      </ImageModalProvider>
    </>
  );
}

export default Notes;
