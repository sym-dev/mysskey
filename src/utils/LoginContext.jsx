import { useState, createContext, useContext } from "react";

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLogin, updateLogin] = useState(false);
  return (
    <LoginContext.Provider value={{ isLogin, updateLogin }}>
      {children}
    </LoginContext.Provider>
  );
};

const useLoginContext = () => useContext(LoginContext);

export { LoginProvider, useLoginContext };
