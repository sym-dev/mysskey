import { useState, createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";

const NotesContext = createContext();

const initialState = [];

function reducer(notes, action) {
  switch (action.type) {
    case "addLower":
      return void notes.push(action.payload);
    case "addUpper":
      return void notes.unshift(action.payload);
    case "updateEmoji":
      if (action.payload.body.userId === localStorage.getItem("UserId")) {
        notes.forEach((note) => {
          if (note.renoteId === action.payload.id) {
            if (
              Object.keys(note.renote.reactions).includes(
                action.payload.body.reaction
              )
            ) {
              note.renote.reactions[action.payload.body.reaction]++;
              note.renote.myReaction = action.payload.body.reaction;
            } else {
              if (action.payload.body.emoji) {
                note.renote.emojis.push(action.payload.body.emoji);
              }
              note.renote.reactions[action.payload.body.reaction] = 1;
              note.renote.myReaction = action.payload.body.reaction;
            }
          } else if (note.id === action.payload.id) {
            if (
              Object.keys(note.reactions).includes(action.payload.body.reaction)
            ) {
              note.reactions[action.payload.body.reaction]++;
              note.myReaction = action.payload.body.reaction;
            } else {
              if (action.payload.body.emoji) {
                note.emojis.push(action.payload.body.emoji);
              }
              note.reactions[action.payload.body.reaction] = 1;
              note.myReaction = action.payload.body.reaction;
            }
          }
        });
      } else {
        notes.forEach((note) => {
          if (note.id === action.payload.id) {
            if (
              Object.keys(note.reactions).includes(action.payload.body.reaction)
            ) {
              note.reactions[action.payload.body.reaction]++;
            } else {
              if (action.payload.body.emoji) {
                note.emojis.push(action.payload.body.emoji);
              }
              note.reactions[action.payload.body.reaction] = 1;
            }
          } else if (
            note.renote &&
            !note.text &&
            note.renote.id === action.payload.id
          ) {
            if (
              Object.keys(note.renote.reactions).includes(
                action.payload.body.reaction
              )
            ) {
              note.renote.reactions[action.payload.body.reaction]++;
            } else {
              if (action.payload.body.emoji) {
                note.renote.emojis.push(action.payload.body.emoji);
              }
              note.renote.reactions[action.payload.body.reaction] = 1;
            }
          }
        });
      }
      return;
    case "deleteEmoji":
      if (action.payload.body.userId === localStorage.getItem("UserId")) {
        notes.forEach((note) => {
          if (note.renoteId === action.payload.id) {
            if (note.renote.reactions[action.payload.body.reaction] - 1 > 0) {
              note.renote.reactions[action.payload.body.reaction]--;
            } else {
              delete note.renote.reactions[action.payload.body.reaction];
            }
            delete note.renote.myReaction;
          } else if (note.id === action.payload.id) {
            if (note.reactions[action.payload.body.reaction] - 1 > 0) {
              note.reactions[action.payload.body.reaction]--;
            } else {
              delete note.reactions[action.payload.body.reaction];
            }
            delete note.myReaction;
          }
        });
      } else {
        notes.forEach((note) => {
          if (note.renoteId === action.payload.id) {
            if (note.renote.reactions[action.payload.body.reaction] - 1 > 0) {
              note.renote.reactions[action.payload.body.reaction]--;
            } else {
              delete note.renote.reactions[action.payload.body.reaction];
            }
          } else if (note.id === action.payload.id) {
            if (note.reactions[action.payload.body.reaction] - 1 > 0) {
              note.reactions[action.payload.body.reaction]--;
            } else {
              delete note.reactions[action.payload.body.reaction];
            }
          }
        });
      }
      return;
    case "remove":
      return notes.filter((note) => note.id !== action.payload.id);
    case "clear":
      return notes.slice(0, 10);
    default:
      return notes;
  }
}

const NotesProvider = ({ children }) => {
  // const [notes, dispatch] = useReducer(reducer, initialState);
  const [notes, dispatch] = useImmerReducer(reducer, initialState);
  const [oldestNoteId, updateOldestNote] = useState("");
  const [moreNote, updateMoreNote] = useState(false);
  return (
    <NotesContext.Provider
      value={{
        notes,
        dispatch,
        oldestNoteId,
        updateOldestNote,
        moreNote,
        updateMoreNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

const useNotesContext = () => useContext(NotesContext);

export { NotesProvider, useNotesContext };
