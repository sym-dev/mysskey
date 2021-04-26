import { useState, createContext, useContext } from "react";

const NoteDetailsContext = createContext();

const NoteDetailsProvider = ({ children }) => {
  const [noteDetails, updateNoteDetails] = useState(false);
  const [noteConversation, updateNoteConversation] = useState([]);
  const [noteChildren, updateNoteChildren] = useState([]);
  return (
    <NoteDetailsContext.Provider
      value={{
        noteDetails,
        updateNoteDetails,
        noteConversation,
        updateNoteConversation,
        noteChildren,
        updateNoteChildren,
      }}
    >
      {children}
    </NoteDetailsContext.Provider>
  );
};

const useNoteDetailsContext = () => useContext(NoteDetailsContext);

export { NoteDetailsProvider, useNoteDetailsContext };
