import { useState, createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";

const NotesContext = createContext();

const initialState = [];

function reducer(notes, action) {
  let indexOfId = -1;
  let indexOfRenoteId = -1;
  switch (action.type) {
    case "addLower":
      return void notes.push(action.payload);
    case "addUpper":
      return void notes.unshift(action.payload);
    case "updateEmoji":
      indexOfId = notes.findIndex((note) => note.id === action.payload.id);
      indexOfRenoteId = notes.findIndex(
        (note) => note.renoteId === action.payload.id
      );
      if (action.payload.body.userId === localStorage.getItem("UserId")) {
        if (indexOfRenoteId > -1) {
          if (
            Object.keys(notes[indexOfRenoteId].renote.reactions).includes(
              action.payload.body.reaction
            )
          ) {
            notes[indexOfRenoteId].renote.reactions[
              action.payload.body.reaction
            ]++;
            notes[indexOfRenoteId].renote.myReaction =
              action.payload.body.reaction;
          } else {
            if (action.payload.body.emoji) {
              notes[indexOfRenoteId].renote.emojis.push(
                action.payload.body.emoji
              );
            }
            notes[indexOfRenoteId].renote.reactions[
              action.payload.body.reaction
            ] = 1;
            notes[indexOfRenoteId].renote.myReaction =
              action.payload.body.reaction;
          }
        }
        if (indexOfId > -1) {
          if (
            Object.keys(notes[indexOfId].reactions).includes(
              action.payload.body.reaction
            )
          ) {
            notes[indexOfId].reactions[action.payload.body.reaction]++;
            notes[indexOfId].myReaction = action.payload.body.reaction;
          } else {
            if (action.payload.body.emoji) {
              notes[indexOfId].emojis.push(action.payload.body.emoji);
            }
            notes[indexOfId].reactions[action.payload.body.reaction] = 1;
            notes[indexOfId].myReaction = action.payload.body.reaction;
          }
        }
      } else {
        if (indexOfRenoteId > -1) {
          if (
            Object.keys(notes[indexOfRenoteId].renote.reactions).includes(
              action.payload.body.reaction
            )
          ) {
            notes[indexOfRenoteId].renote.reactions[
              action.payload.body.reaction
            ]++;
          } else {
            if (action.payload.body.emoji) {
              notes[indexOfRenoteId].renote.emojis.push(
                action.payload.body.emoji
              );
            }
            notes[indexOfRenoteId].renote.reactions[
              action.payload.body.reaction
            ] = 1;
          }
        }
        if (indexOfId > -1) {
          if (
            Object.keys(notes[indexOfId].reactions).includes(
              action.payload.body.reaction
            )
          ) {
            notes[indexOfId].reactions[action.payload.body.reaction]++;
          } else {
            if (action.payload.body.emoji) {
              notes[indexOfId].emojis.push(action.payload.body.emoji);
            }
            notes[indexOfId].reactions[action.payload.body.reaction] = 1;
          }
        }
      }
      return;
    case "deleteEmoji":
      indexOfId = notes.findIndex((note) => note.id === action.payload.id);
      indexOfRenoteId = notes.findIndex(
        (note) => note.renoteId === action.payload.id
      );
      if (indexOfId > -1) {
        if (notes[indexOfId].reactions[action.payload.body.reaction] > 2) {
          notes[indexOfId].reactions[action.payload.body.reaction]--;
        } else {
          delete notes[indexOfId].reactions[action.payload.body.reaction];
        }
        delete notes[indexOfId].myReaction;
      }
      if (indexOfRenoteId > -1) {
        if (
          notes[indexOfRenoteId].renote.reactions[
            action.payload.body.reaction
          ] > 2
        ) {
          notes[indexOfRenoteId].renote.reactions[
            action.payload.body.reaction
          ]--;
        } else {
          delete notes[indexOfRenoteId].renote.reactions[
            action.payload.body.reaction
          ];
        }
        delete notes[indexOfRenoteId].renote.myReaction;
      }
      return;
    case "remove":
      return notes.filter((note) => note.id !== action.payload.id);
    case "clear":
      return notes.slice(0, 10);
    case "clearAll":
      return [];
    default:
      return notes;
  }
}

const NotesProvider = ({ children }) => {
  const [notes, dispatch] = useImmerReducer(reducer, initialState);
  const [oldestNoteId, updateOldestNote] = useState("");
  const [moreNote, updateMoreNote] = useState(false);
  const [isLastNote, updateLastNote] = useState(false);
  return (
    <NotesContext.Provider
      value={{
        notes,
        dispatch,
        oldestNoteId,
        updateOldestNote,
        moreNote,
        updateMoreNote,
        isLastNote,
        updateLastNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

const useNotesContext = () => useContext(NotesContext);

export { NotesProvider, useNotesContext };
