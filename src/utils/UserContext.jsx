import { useState, createContext, useContext } from "react";

const UserContext = createContext();

const UserPovider = ({ children }) => {
  const [userInfo, updateUserinfo] = useState(false);
  const [userNotes, updateUserNotes] = useState(false);
  const [oldestUserNoteId, updateOldestUserNoteId] = useState("");
  const [moreUserNote, updateMoreUserNote] = useState(false);
  const [isLastUserNote, updateLastUserNote] = useState(false);
  const [followers, updateFollowers] = useState(false);
  const [followings, updateFollowings] = useState(false);
  const [oldestFols, updateOldefsFols] = useState("");
  const [moreFols, updateMoreFols] = useState(false);
  const [isLastFols, updateLastFols] = useState(false);
  const [followRequests, updateFollowRequests] = useState(false);
  return (
    <UserContext.Provider
      value={{
        userInfo,
        updateUserinfo,
        userNotes,
        updateUserNotes,
        oldestUserNoteId,
        updateOldestUserNoteId,
        moreUserNote,
        updateMoreUserNote,
        isLastUserNote,
        updateLastUserNote,
        followers,
        updateFollowers,
        followings,
        updateFollowings,
        oldestFols,
        updateOldefsFols,
        moreFols,
        updateMoreFols,
        isLastFols,
        updateLastFols,
        followRequests,
        updateFollowRequests,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export { UserPovider, useUserContext };
