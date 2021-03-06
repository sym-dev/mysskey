import parseEmojis from "../utils/parseEmojis";
import { useState } from "react";
import { useSocketContext } from "../utils/SocketContext";

export default function Reactions({ data }) {
  const { socketRef } = useSocketContext();
  const actualData = data.renoteId && !data.text ? data.renote : data;
  const [myReaction, updateMyReaction] = useState(actualData.myReaction);

  return (
    <div className="reactionBar">
      {Object.keys(actualData.reactions).map((key) => (
        <button
          className={key === actualData.myReaction ? "enabled" : ""}
          key={key}
          disabled={key.match(/\S+@\S+\.\S+/g)}
          onClick={() => {
            if (!myReaction) {
              socketRef.current.send(
                JSON.stringify({
                  type: "api",
                  body: {
                    id: "reactionCreate",
                    endpoint: "notes/reactions/create",
                    data: {
                      i: localStorage.getItem("UserToken"),
                      noteId: actualData.id,
                      reaction: key,
                    },
                  },
                })
              );
              updateMyReaction(key);
            } else {
              socketRef.current.send(
                JSON.stringify({
                  type: "api",
                  body: {
                    id: "reactionDelete",
                    endpoint: "notes/reactions/delete",
                    data: {
                      i: localStorage.getItem("UserToken"),
                      noteId: actualData.id,
                    },
                  },
                })
              );
              updateMyReaction(false);
            }
          }}
        >
          {parseEmojis(key, actualData.emojis)}
          <span>{actualData.reactions[key]}</span>
        </button>
      ))}
    </div>
  );
}
