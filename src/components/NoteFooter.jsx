import { useRef, useState } from "react";
import {
  IoRepeat,
  IoArrowUndo,
  IoBan,
  IoAddCircle,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { useSocketContext } from "../utils/SocketContext";
import { usePostModalContext } from "../utils/ModalContext";
import { useOverlayContext } from "../utils/OverlayContext";
import { useDetectOutsideClick } from "../utils/useDetectOutsideClick";
import EmojiModal from "./EmojiModal";

export default function NoteFooter({ data }) {
  const { socketRef } = useSocketContext();
  const { updateOverlay } = useOverlayContext();
  const emojiRef = useRef(null);
  const etcRef = useRef(null);
  const [isEmojiActive, setEmoji] = useDetectOutsideClick(emojiRef, false);
  const [isEtcActive, setEtc] = useDetectOutsideClick(etcRef, false);
  const [emojiModalPlace, setEmojiModalPlace] = useState(0);

  const actualData = data.renoteId && !data.text ? data.renote : data;
  const { updatePostModal, updateReplyProp, updateRenoteProp } =
    usePostModalContext();
  return (
    <footer className="noteFooter">
      <div>
        <button
          onClick={() => {
            updatePostModal(true);
            updateReplyProp(data);
          }}
        >
          <IoArrowUndo fontSize="1.2em" />
        </button>
        <span>{actualData.repliesCount}</span>
      </div>

      {data.visibility === "specified" || data.visibility === "followers" ? (
        <div>
          <button disabled>
            <IoBan fontSize="1.2em" />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              updatePostModal(true);
              updateRenoteProp(data);
            }}
          >
            <IoRepeat fontSize="1.2em" />
          </button>
          <span>{actualData.renoteCount}</span>
        </div>
      )}

      <div className="emojiContainer">
        <button
          onClick={(e) => {
            setEmojiModalPlace(
              e.view.outerHeight - e.clientY > 400
                ? 0
                : e.view.outerHeight - e.clientY - 400
            );
            setEmoji(!isEmojiActive);
            updateOverlay(true);
          }}
        >
          <IoAddCircle fontSize="1.2em" />
        </button>
        {isEmojiActive && (
          <div ref={emojiRef}>
            <EmojiModal
              type="reaction"
              fn={setEmoji}
              isActive={isEmojiActive}
              y={emojiModalPlace}
              noteId={actualData.id}
            />
          </div>
        )}
      </div>

      <div>
        <div className="menuContainer">
          <button
            onClick={() => {
              setEtc(!isEtcActive);
              updateOverlay(true);
            }}
          >
            <IoEllipsisHorizontal fontSize="1.2em" />
          </button>
          <nav
            ref={etcRef}
            className={`menu ${isEtcActive ? "active" : "inactive"}`}
          >
            <button
              onClick={() => {
                navigator.clipboard.writeText(actualData.text);
                setEtc(!isEtcActive);
                updateOverlay(false);
              }}
            >
              内容をコピー
            </button>
            <hr />
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  "https://" +
                    localStorage.getItem("instanceURL") +
                    "/notes/" +
                    data.id
                );
                setEtc(!isEtcActive);
                updateOverlay(false);
              }}
            >
              リンクををコピー
            </button>
            {data.user.id === localStorage.getItem("UserId") && (
              <>
                <hr />
                <button
                  onClick={() => {
                    socketRef.current.send(
                      JSON.stringify({
                        type: "api",
                        body: {
                          id: "delete",
                          endpoint: "notes/delete",
                          data: {
                            i: localStorage.getItem("UserToken"),
                            noteId: data.id,
                          },
                        },
                      })
                    );
                    setEtc(!isEtcActive);
                    updateOverlay(false);
                  }}
                >
                  削除
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </footer>
  );
}
