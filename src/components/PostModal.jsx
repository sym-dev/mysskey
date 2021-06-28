import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import {
  IoAddCircle,
  IoEye,
  IoEyeOff,
  IoGlobe,
  IoHome,
  IoLockClosed,
} from "react-icons/io5";
import { usePostModalContext } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useDetectOutsideClick } from "../utils/useDetectOutsideClick";
import { useForm } from "react-hook-form";
import Note from "./Note";
import EmojiModal from "./EmojiModal";

export default function PostModal() {
  const { socketRef } = useSocketContext();
  const [emojiModalPlace, setEmojiModalPlace] = useState(0);
  const [addedEmoji, addEmoji] = useState(false);
  const [isCW, updateCW] = useState(false);
  const {
    postModal,
    updatePostModal,
    replyProp,
    updateReplyProp,
    renoteProp,
    updateRenoteProp,
  } = usePostModalContext();
  const { register, handleSubmit, reset } = useForm();
  const textareaElement = useRef(null);
  const emojiRef = useRef(null);
  const cwElement = useRef(null);
  const visibilityRef = useRef(null);
  const [visibility, setVisibility] = useState("public");
  const [isEmojiActive, setEmoji] = useDetectOutsideClick(emojiRef, false);
  const [isVisibilityActive, setVisibilityActive] = useDetectOutsideClick(
    visibilityRef,
    false
  );
  const onSubmitPost = (data) => {
    const createNoteObject = {
      type: "api",
      body: {
        id: "create",
        endpoint: "notes/create",
        data: {
          i: localStorage.getItem("UserToken"),
          visibility: visibility,
          text: data.text ? data.text : null,
          cw: data.cw ? data.cw : null,
          replyId: data.replyId ? data.replyId : null,
          renoteId: data.renoteId ? data.renoteId : null,
        },
      },
    };
    socketRef.current.send(JSON.stringify(createNoteObject));
    updateReplyProp(false);
    updateRenoteProp(false);
    updateCW(false);
    updatePostModal(false);
    reset();
  };
  useEffect(() => {
    if (addedEmoji) {
      textareaElement.current.value += addedEmoji;
      textareaElement.current.focus();
      addEmoji(false);
    }
  }, [addedEmoji]);
  return (
    <Modal
      isOpen={postModal}
      onRequestClose={() => {
        updateReplyProp("");
        updateRenoteProp("");
        updatePostModal(false);
      }}
      className="modal postModal"
      overlayClassName="Overlay"
    >
      {replyProp && (
        <div className="note">
          <Note
            data={replyProp}
            depth={1}
            type={
              !replyProp.renoteId
                ? "general"
                : replyProp.text || replyProp.files.length
                ? "quote"
                : "renote"
            }
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmitPost)}>
        {isCW && (
          <input
            type="text"
            className="cw"
            placeholder="注釈"
            {...register("cw")}
            ref={cwElement}
          />
        )}
        <textarea
          {...register("text")}
          placeholder={
            replyProp
              ? "このノートに返信..."
              : renoteProp
              ? "引用(空だと通常のRenoteになります)"
              : "何を考えていますか？"
          }
          required={!renoteProp}
          ref={textareaElement}
          autoFocus
        ></textarea>
        <input
          type="hidden"
          {...register("replyId")}
          value={replyProp ? replyProp.id : ""}
        ></input>
        <input
          type="hidden"
          {...register("renoteId")}
          value={renoteProp ? renoteProp.id : ""}
        ></input>
        <input type="submit" value="投稿" />
      </form>
      <div className="postFooter">
        <div className="emojiContainer">
          <button
            title="絵文字"
            onClick={(e) => {
              setEmojiModalPlace(
                e.view.outerHeight - e.clientY > 400
                  ? 0
                  : e.view.outerHeight - e.clientY - 400
              );
              setEmoji(!isEmojiActive);
            }}
          >
            <IoAddCircle fontSize="1.5em" />
          </button>
          {isEmojiActive && (
            <div ref={emojiRef}>
              <EmojiModal
                type="emoji"
                fn={setEmoji}
                isActive={isEmojiActive}
                y={emojiModalPlace}
                addEmoji={addEmoji}
              />
            </div>
          )}
        </div>
        <button
          title="内容を隠す"
          onClick={() => {
            if (isCW) {
              cwElement.current.value = "";
            }
            updateCW(!isCW);
          }}
        >
          {isCW ? <IoEye fontSize="1.5em" /> : <IoEyeOff fontSize="1.5em" />}
        </button>
        <button
          title="公開範囲"
          className="visibilityButton"
          onClick={() => {
            setVisibilityActive(!isVisibilityActive);
          }}
        >
          {visibility === "public" ? (
            <IoGlobe fontSize="1.5em" />
          ) : visibility === "home" ? (
            <IoHome fontSize="1.5em" />
          ) : visibility === "followers" ? (
            <IoLockClosed fontSize="1.5em" />
          ) : (
            "?"
          )}
        </button>
        <nav
          ref={visibilityRef}
          className={`menu ${isVisibilityActive ? "active" : "inactive"}`}
        >
          <button
            onClick={() => {
              setVisibility("public");
              setVisibilityActive(!isVisibilityActive);
            }}
          >
            <IoGlobe fontSize="1.3em" />
            グローバル
          </button>
          <hr />
          <button
            onClick={() => {
              setVisibility("home");
              setVisibilityActive(!isVisibilityActive);
            }}
          >
            <IoHome fontSize="1.3em" />
            ホーム
          </button>
          <hr />
          <button
            onClick={() => {
              setVisibility("followers");
              setVisibilityActive(!isVisibilityActive);
            }}
          >
            <IoLockClosed fontSize="1.3em" />
            フォロワー
          </button>
        </nav>
      </div>
      {renoteProp && (
        <div className="note">
          <Note
            data={renoteProp}
            depth={1}
            type={
              !renoteProp.renoteId
                ? "general"
                : renoteProp.text || renoteProp.files.length
                ? "quote"
                : "renote"
            }
          />
        </div>
      )}
    </Modal>
  );
}
