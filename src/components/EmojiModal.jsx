import Modal from "react-modal";
import { useEmojiModalContext } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useForm } from "react-hook-form";
import { IoCheckmark } from "react-icons/io5";

export default function EmojiModal() {
  const customEmojis = JSON.parse(localStorage.getItem("meta")).emojis;
  const emojiCategory = [...new Set(customEmojis.map((item) => item.category))];
  const { socketRef } = useSocketContext();
  const {
    emojiModal,
    updateEmojiModal,
    emojiModalPlace,
    noteId,
    updateNoteId,
  } = useEmojiModalContext();
  const { register, handleSubmit, setValue } = useForm();
  const onSubmitReaction = (data) => {
    let createReactionObject = {
      type: "api",
      body: {
        id: "reaction",
        endpoint: "notes/reactions/create",
        data: {
          i: localStorage.getItem("UserToken"),
          noteId: noteId,
          reaction: data.reaction,
        },
      },
    };
    socketRef.current.send(JSON.stringify(createReactionObject));
    updateNoteId("");
    updateEmojiModal(false);
  };
  const onSubmitReactionByEmoji = (data) => {
    let createReactionObject = {
      type: "api",
      body: {
        id: "reaction",
        endpoint: "notes/reactions/create",
        data: {
          i: localStorage.getItem("UserToken"),
          noteId: noteId,
          reaction: ":" + data.emoji + ":",
        },
      },
    };
    socketRef.current.send(JSON.stringify(createReactionObject));
    updateNoteId("");
    updateEmojiModal(false);
  };
  return (
    <Modal
      isOpen={emojiModal}
      onRequestClose={() => {
        updateNoteId("");
        updateEmojiModal(false);
      }}
      style={{
        content: {
          position: "absolute",
          top: emojiModalPlace.y + 20,
          left: emojiModalPlace.x - 100,
        },
      }}
      className="emojiModal"
      overlayClassName="Overlay"
    >
      <form onSubmit={handleSubmit(onSubmitReaction)}>
        <div className="userInput">
          <input
            type="text"
            name="reaction"
            ref={register}
            placeholder={"input emoji..."}
            onSubmit={handleSubmit(onSubmitReaction)}
            required
          ></input>
          <button onSubmit={handleSubmit(onSubmitReaction)}>
            <IoCheckmark />
          </button>
        </div>
      </form>
      <form onSubmit={handleSubmit(onSubmitReactionByEmoji)}>
        <div className="emojis">
          {emojiCategory.map((cat) => (
            <details key={cat}>
              <summary>{cat}</summary>
              <div className="emojisContainer">
                {customEmojis
                  .filter((emoji) => emoji.category === cat)
                  .map((data) => (
                    <button
                      key={data.id}
                      onClick={() => {
                        setValue("emoji", data.name);
                        handleSubmit(onSubmitReactionByEmoji);
                      }}
                    >
                      <img src={data.url} alt={data.name} loading="lazy" />
                      <input type="hidden" name="emoji" ref={register} />
                    </button>
                  ))}
              </div>
            </details>
          ))}
        </div>
      </form>
    </Modal>
  );
}
