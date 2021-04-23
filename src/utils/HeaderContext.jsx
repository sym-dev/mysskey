import { useState, createContext, useContext } from "react";

const HeaderContext = createContext();

const HeaderProvider = ({ children }) => {
  const [headerValue, updateHeaderValue] = useState(" ");
  return (
    <HeaderContext.Provider value={{ headerValue, updateHeaderValue }}>
      {children}
    </HeaderContext.Provider>
  );
};

const useHeaderContext = () => useContext(HeaderContext);

export { HeaderProvider, useHeaderContext };
