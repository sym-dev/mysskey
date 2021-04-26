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
import Reactions from "../components/Reactions";
import NoteFooter from "../components/NoteFooter";

function Notes() {
  let noteId = document.location.pathname.split("/")[2];
  let location = useLocation();
  const { updateHeaderValue } = useHeaderContext();
  const { socketRef } = useSocketContext();
  const {
    noteDetails,
    noteConversation,
    noteChildren,
  } = useNoteDetailsContext();
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
    const noteConversationObject = {
      type: "api",
      body: {
        id: "noteConversation",
        endpoint: "notes/conversation",
        data: {
          i: localStorage.getItem("UserToken"),
          noteId: noteId,
          limit: 15,
        },
      },
    };
    const noteChildrenObject = {
      type: "api",
      body: {
        id: "noteChildren",
        endpoint: "notes/children",
        data: {
          i: localStorage.getItem("UserToken"),
          noteId: noteId,
          limit: 15,
        },
      },
    };
    const socketState = setInterval(() => {
      if (socketRef.current.readyState === 1) {
        socketRef.current.send(JSON.stringify(noteDetailsObject));
        socketRef.current.send(JSON.stringify(noteConversationObject));
        socketRef.current.send(JSON.stringify(noteChildrenObject));
        clearInterval(socketState);
      }
    }, 100);
  }, [noteId, location, updateHeaderValue, socketRef]);
  return (
    <>
      <ImageModalProvider>
        <main>
          {noteConversation.length > 0 && (
            <div className="context">
              {noteConversation.map((data) => (
                <div className="note" key={data.id}>
                  <Note
                    data={data}
                    depth={1}
                    type={
                      !data.renoteId
                        ? "general"
                        : data.text || data.files.length
                        ? "quote"
                        : "renote"
                    }
                  />
                </div>
              ))}
            </div>
          )}
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
              <Reactions data={noteDetails} />
              <NoteFooter data={noteDetails} />
            </div>
          )}
          {noteChildren.length > 0 && (
            <div className="children">
              {noteChildren.map((data) => (
                <div className="note" key={data.id}>
                  <Note
                    data={data}
                    depth={1}
                    type={
                      !data.renoteId
                        ? "general"
                        : data.text || data.files.length
                        ? "quote"
                        : "renote"
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </main>
        <ImageModal />
      </ImageModalProvider>
    </>
  );
}

export default Notes;
