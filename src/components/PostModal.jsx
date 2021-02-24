import Modal from "react-modal";
import { usePostModalContext } from "../ModalContext";
import { useForm } from "react-hook-form";
import Note from "./Note";

export default function PostModal(props) {
  let socket = props.socket;
  const {
    postModal,
    updatePostModal,
    postProp,
    updatePostProp,
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
          replyId: data.id ? data.id : null,
        },
      },
    };
    socket.send(JSON.stringify(createNoteObject));
    updatePostProp("");
    updatePostModal(false);
  };
  return (
    <Modal
      isOpen={postModal}
      onRequestClose={() => {
        updatePostProp("");
        updatePostModal(false);
      }}
      className="postModal"
      overlayClassName="Overlay"
    >
      {postProp && (
        <div className="note">
          <Note
            data={postProp}
            depth={1}
            type={
              !postProp.renoteId
                ? "general"
                : postProp.text || postProp.files.length
                ? "quote"
                : "renote"
            }
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmitPost)}>
        <textarea
          name="text"
          ref={register}
          placeholder={
            postProp ? "このノートに返信..." : "何を考えていますか？"
          }
          onSubmit={handleSubmit(onSubmitPost)}
          autoFocus
          required
        ></textarea>
        <input
          type="hidden"
          name="id"
          value={postProp ? postProp.id : undefined}
          ref={register}
        ></input>
        <input type="submit" value="投稿" />
      </form>
    </Modal>
  );
}
