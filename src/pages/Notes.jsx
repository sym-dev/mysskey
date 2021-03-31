import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoDocumentText } from "react-icons/io5";
import { useHeaderContext } from "../utils/HeaderContext";
import { ImageModalProvider } from "../utils/ModalContext";
import ImageModal from "../components/ImageModal";
import Loading from "../components/Loading";
import Note from "../components/Note";

function Notes() {
  let noteId = document.location.pathname.split("/")[2];
  let location = useLocation();
  const { updateHeaderValue } = useHeaderContext();
  const [note, update] = useState(null);
  useEffect(() => {
    updateHeaderValue(
      <>
        <IoDocumentText fontSize="1.2em" />
        Note
      </>
    );
    const noteURL =
      "https://" + localStorage.getItem("instanceURL") + "/api/notes/show";
    const body = {
      i: localStorage.getItem("UserToken"),
      noteId: noteId,
    };
    fetch(noteURL, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((text) => {
        // console.log(text);
        update(text);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [noteId, location, updateHeaderValue]);
  return (
    <>
      <ImageModalProvider>
        <main>
          {note === null ? (
            <Loading />
          ) : (
            <div key={note.id} className="note">
              <Note
                data={note}
                depth={0}
                type={
                  !note.renoteId
                    ? "general"
                    : note.text || note.files.length
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
