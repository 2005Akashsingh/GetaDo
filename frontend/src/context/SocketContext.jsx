import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = "http://localhost:8000";

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let activeSocket = null;

    // Auth happens server-side off the same JWT cookie the REST API uses (see backend/src/sockets/index.js)
    const connect = async () => {
      const s = io(SOCKET_URL, { withCredentials: true });
      activeSocket = s;
      setSocket(s);
    };
    connect();

    return () => {
      activeSocket?.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
