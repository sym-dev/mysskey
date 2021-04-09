import Modal from "react-modal";
import { usePostModalContext } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useForm } from "react-hook-form";
import Note from "./Note";

export default function PostModal() {
  const { socketRef } = useSocketContext();
  const {
    postModal,
    updatePostModal,
    replyProp,
    updateReplyProp,
    renoteProp,
    updateRenoteProp,
  } = usePostModalContext();
  const { register, handleSubmit } = useForm();
  const onSubmitPost = (data) => {
    let createNoteObject = {
      type: "api",
      body: {
        id: "create",
        endpoint: "notes/create",
        data: {
          i: localStorage.getItem("UserToken"),
          text: data.text ? data.text : null,
          replyId: data.replyId ? data.replyId : null,
          renoteId: data.renoteId ? data.renoteId : null,
        },
      },
    };
    socketRef.current.send(JSON.stringify(createNoteObject));
    updateReplyProp("");
    updateRenoteProp("");
    updatePostModal(false);
  };
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
