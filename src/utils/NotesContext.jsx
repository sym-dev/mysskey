import { useState, useReducer, createContext, useContext } from "react";

const NotesContext = createContext();

const initialState = [];

function reducer(notes, action) {
  switch (action.type) {
    case "addLower":
      return [...notes, action.payload];
    case "addUpper":
      return [action.payload, ...notes];
    case "updateEmoji":
      if (action.payload.body.userId === localStorage.getItem("UserId")) {
        return notes.map((note) => {
          if (note.id === action.payload.id) {
            if (
              Object.keys(note.reactions).includes(action.payload.body.reaction)
            ) {
              return {
                ...note,
                reactions: {
                  ...note.reactions,
                  [action.payload.body.reaction]:
                    note.reactions[action.payload.body.reaction] + 1,
                },
                myReaction: action.payload.body.reaction,
              };
            } else {
              if (action.payload.body.emoji) {
                return {
                  ...note,
                  emojis: [...note.emojis, action.payload.body.emoji],
                  reactions: {
                    ...note.reactions,
                    [action.payload.body.reaction]: 1,
                  },
                  myReaction: action.payload.body.reaction,
                };
              } else {
                return {
                  ...note,
                  reactions: {
                    ...note.reactions,
                    [action.payload.body.reaction]: 1,
                  },
                  myReaction: action.payload.body.reaction,
                };
              }
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
              return {
                ...note,
                renote: {
                  ...note.renote,
                  reactions: {
                    ...note.renote.reactions,
                    [action.payload.body.reaction]:
                      note.renote.reactions[action.payload.body.reaction] + 1,
                  },
                  myReaction: action.payload.body.reaction,
                },
              };
            } else {
              if (action.payload.body.emoji) {
                return {
                  ...note,
                  renote: {
                    ...note.renote,
                    emojis: [...note.renote.emojis, action.payload.body.emoji],
                    reactions: {
                      ...note.renote.reactions,
                      [action.payload.body.reaction]: 1,
                    },
                    myReaction: action.payload.body.reaction,
                  },
                };
              } else {
                return {
                  ...note,
                  renote: {
                    ...note.renote,
                    reactions: {
                      ...note.renote.reactions,
                      [action.payload.body.reaction]: 1,
                    },
                    myReaction: action.payload.body.reaction,
                  },
                };
              }
            }
          } else {
            return note;
          }
        });
      } else {
        return notes.map((note) => {
          if (note.id === action.payload.id) {
            if (
              Object.keys(note.reactions).includes(action.payload.body.reaction)
            ) {
              return {
                ...note,
                reactions: {
                  ...note.reactions,
                  [action.payload.body.reaction]:
                    note.reactions[action.payload.body.reaction] + 1,
                },
              };
            } else {
              if (action.payload.body.emoji) {
                return {
                  ...note,
                  emojis: [...note.emojis, action.payload.body.emoji],
                  reactions: {
                    ...note.reactions,
                    [action.payload.body.reaction]: 1,
                  },
                };
              } else {
                return {
                  ...note,
                  reactions: {
                    ...note.reactions,
                    [action.payload.body.reaction]: 1,
                  },
                };
              }
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
              return {
                ...note,
                renote: {
                  ...note.renote,
                  reactions: {
                    ...note.renote.reactions,
                    [action.payload.body.reaction]:
                      note.renote.reactions[action.payload.body.reaction] + 1,
                  },
                },
              };
            } else {
              if (action.payload.body.emoji) {
                return {
                  ...note,
                  renote: {
                    ...note.renote,
                    emojis: [...note.renote.emojis, action.payload.body.emoji],
                    reactions: {
                      ...note.renote.reactions,
                      [action.payload.body.reaction]: 1,
                    },
                  },
                };
              } else {
                return {
                  ...note,
                  renote: {
                    ...note.renote,
                    reactions: {
                      ...note.renote.reactions,
                      [action.payload.body.reaction]: 1,
                    },
                  },
                };
              }
            }
          } else {
            return note;
          }
        });
      }
    case "deleteEmoji":
      return notes.map((note) => {
        if (note.id === action.payload.id) {
          if (note.reactions[action.payload.body.reaction] - 1 > 0) {
            const { myReaction, ...obj1 } = note;
            return {
              ...obj1,
              reactions: {
                ...obj1.reactions,
                [action.payload.body.reaction]:
                  obj1.reactions[action.payload.body.reaction] - 1,
              },
            };
          } else {
            const { myReaction, ...obj2 } = note;
            const {
              [action.payload.body.reaction]: foo,
              ...obj3
            } = obj2.reactions;
            return {
              ...obj2,
              reactions: obj3,
            };
          }
        } else if (
          note.renote &&
          !note.text &&
          note.renote.id === action.payload.id
        ) {
          if (note.renote.reactions[action.payload.body.reaction] - 1 > 0) {
            const { myReaction, ...obj1 } = note.renote;
            return {
              ...note,
              renote: {
                ...obj1,
                reactions: {
                  ...obj1.reactions,
                  [action.payload.body.reaction]:
                    obj1.reactions[action.payload.body.reaction] - 1,
                },
              },
            };
          } else {
            const { myReaction, ...obj2 } = note.renote;
            const {
              [action.payload.body.reaction]: foo,
              ...obj3
            } = obj2.reactions;
            return {
              ...note,
              renote: {
                ...obj2,
                reactions: obj3,
              },
            };
          }
        } else {
          return note;
        }
      });
    case "remove":
      return notes.filter((note) => note.id !== action.payload.id);
    case "clear":
      return initialState;
    default:
      return notes;
  }
}

const NotesProvider = ({ children }) => {
  const [notes, dispatch] = useReducer(reducer, initialState);
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
