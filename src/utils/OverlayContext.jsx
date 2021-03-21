import { useState, createContext, useContext } from "react";

const OverlayContext = createContext();

const OverlayProvider = ({ children }) => {
  const [isOverlayActive, updateOverlay] = useState(false);
  return (
    <OverlayContext.Provider value={{ isOverlayActive, updateOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
};

const useOverlayContext = () => useContext(OverlayContext);

export { OverlayProvider, useOverlayContext };
