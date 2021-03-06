import parseEmojis from "../utils/parseEmojis";
import { twemojify } from "react-twemojify";
import { createImgElement } from "react-twemojify/lib/img";
import { useState } from "react";

export default function Reactions(props) {
  const actualData =
    props.data.renoteId && !props.data.text ? props.data.renote : props.data;
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
              props.socket.send(
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
              if (key === myReaction) {
                props.socket.send(
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
              } else {
                props.socket.send(
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
              }
            }
          }}
        >
          {parseEmojis(twemojify(key, createImgElement), actualData.emojis)}
          <span>{actualData.reactions[key]}</span>
        </button>
      ))}
    </div>
  );
}
