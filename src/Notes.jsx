import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ImageModalProvider } from "./ModalContext";
import ImageModal from "./components/ImageModal";
import Loading from "./components/Loading";
import Note from "./components/Note";

function Notes() {
  let noteId = document.location.pathname.split("/")[2];
  const [note, update] = useState(null);
  useEffect(() => {
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
  }, [noteId]);
  return (
    <>
      <ImageModalProvider>
        <header>
          <h3>Notes</h3>
          <Link to="/">戻る</Link>
        </header>
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
