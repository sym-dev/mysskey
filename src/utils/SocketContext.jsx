import { useRef, createContext, useContext } from "react";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socketRef = useRef();
  socketRef.current = new WebSocket(
    "wss://" +
      localStorage.getItem("instanceURL") +
      "/streaming?i=" +
      localStorage.getItem("UserToken")
  );
  console.log("SOCKET OPEND");

  socketRef.current.onerror = (error) => {
    console.error(error);
  };

  socketRef.current.onclose = (e) => {
    console.log("SOCKET CLOSED");
  };

  return (
    <SocketContext.Provider value={{ socketRef }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => useContext(SocketContext);

export { SocketProvider, useSocketContext };
