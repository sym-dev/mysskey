import { useState, createContext, useContext } from "react";

const NoteDetailsContext = createContext();

const NoteDetailsProvider = ({ children }) => {
  const [noteDetails, updateNoteDetails] = useState(false);
  return (
    <NoteDetailsContext.Provider
      value={{
        noteDetails,
        updateNoteDetails,
      }}
    >
      {children}
    </NoteDetailsContext.Provider>
  );
};

const useNoteDetailsContext = () => useContext(NoteDetailsContext);

export { NoteDetailsProvider, useNoteDetailsContext };
