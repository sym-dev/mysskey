import Modal from "react-modal";
import { useRenoteModalContext } from "../ModalContext";
import { useForm } from "react-hook-form";
import Note from "./Note";

export default function RenoteModal(props) {
  let socket = props.socket;
  const {
    renoteModal,
    updateRenoteModal,
    renoteProp,
  } = useRenoteModalContext();
  const { register, handleSubmit } = useForm();
  const onSubmitRenote = (data) => {
    let createNoteObject = {
      type: "api",
      body: {
        id: "create",
        endpoint: "notes/create",
        data: {
          i: localStorage.getItem("UserToken"),
          text: data.text ? data.text : null,
          renoteId: data.id,
        },
      },
    };
    socket.send(JSON.stringify(createNoteObject));
    updateRenoteModal(false);
  };
  return (
    <Modal
      isOpen={renoteModal}
      onRequestClose={() => updateRenoteModal(false)}
      // className="renoteModal"
      className="postModal"
      overlayClassName="Overlay"
    >
      <form onSubmit={handleSubmit(onSubmitRenote)}>
        <textarea
          name="text"
          ref={register}
          placeholder="引用(空だと通常のRenoteになります)"
        ></textarea>
        <input
          type="hidden"
          name="id"
          value={renoteProp.id}
          ref={register}
        ></input>
        <input type="submit" />
      </form>

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
    </Modal>
  );
}
