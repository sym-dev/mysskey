import { useState, createContext, useContext } from "react";

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, updateNotifications] = useState([]);
  const [oldestNotificationId, updateOldestNotificationId] = useState("");
  const [moreNotification, updateMoreNotification] = useState(false);
  const [isLastNotification, updateLastNotification] = useState(false);
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        updateNotifications,
        oldestNotificationId,
        updateOldestNotificationId,
        moreNotification,
        updateMoreNotification,
        isLastNotification,
        updateLastNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotificationContext = () => useContext(NotificationContext);

export { NotificationProvider, useNotificationContext };
