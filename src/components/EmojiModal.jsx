import Modal from "react-modal";
import { useEmojiModalContext } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useForm } from "react-hook-form";
import { IoCheckmark, IoTime } from "react-icons/io5";

export default function EmojiModal() {
  let RUEmoji = Array.isArray(JSON.parse(localStorage.getItem("RUEmoji")))
    ? JSON.parse(localStorage.getItem("RUEmoji"))
    : [];
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
  const { register, watch, handleSubmit, setValue } = useForm();
  const search = watch("searchEmoji");
  const onSubmitReaction = (data) => {
    let createReactionObject = {
      type: "api",
      body: {
        id: "reaction",
        endpoint: "notes/reactions/create",
        data: {
          i: localStorage.getItem("UserToken"),
          noteId: noteId,
          reaction: data.reaction ? data.reaction : ":" + data.emoji + ":",
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
          />
          <button onSubmit={handleSubmit(onSubmitReaction)}>
            <IoCheckmark />
          </button>
        </div>
      </form>
      <div className="emojis">
        <div className="emojisWrapper">
          <form onSubmit={handleSubmit(onSubmitReaction)}>
            <div className="emojisContainer">
              {search &&
                customEmojis
                  .filter((emoji) => emoji.name.includes(search))
                  .slice(0, 12)
                  .map((data) => (
                    <button
                      key={data.id}
                      onClick={() => {
                        RUEmoji = RUEmoji.filter(
                          (emoji) => emoji.id !== data.id
                        );
                        RUEmoji.unshift(data);
                        if (RUEmoji.length > 10) {
                          RUEmoji.pop();
                        }
                        localStorage.setItem(
                          "RUEmoji",
                          JSON.stringify(RUEmoji)
                        );
                        setValue("emoji", data.name);
                        handleSubmit(onSubmitReaction);
                      }}
                    >
                      <img src={data.url} alt={data.name} loading="lazy" />
                    </button>
                  ))}
            </div>
            <input type="hidden" name="emoji" ref={register} />
          </form>
          <form onSubmit={handleSubmit(onSubmitReaction)}>
            <p>
              <IoTime />
              最近使用
            </p>
            <div className="RUEmoji">
              {Array.isArray(RUEmoji) &&
                RUEmoji.map((data) => (
                  <button
                    key={data.id}
                    onClick={() => {
                      setValue("emoji", data.name);
                      handleSubmit(onSubmitReaction);
                    }}
                  >
                    <img src={data.url} alt={data.name} loading="lazy" />
                  </button>
                ))}
              <input type="hidden" name="emoji" ref={register} />
            </div>
            {emojiCategory.map((cat) => (
              <details key={cat}>
                <summary>{cat ? cat : "その他"}</summary>
                <div className="emojisContainer">
                  {customEmojis
                    .filter((emoji) => emoji.category === cat)
                    .map((data) => (
                      <button
                        key={data.id}
                        onClick={() => {
                          RUEmoji = RUEmoji.filter(
                            (emoji) => emoji.id !== data.id
                          );
                          RUEmoji.unshift(data);
                          if (RUEmoji.length > 10) {
                            RUEmoji.pop();
                          }
                          localStorage.setItem(
                            "RUEmoji",
                            JSON.stringify(RUEmoji)
                          );
                          setValue("emoji", data.name);
                          handleSubmit(onSubmitReaction);
                        }}
                      >
                        <img src={data.url} alt={data.name} loading="lazy" />
                      </button>
                    ))}
                  <input type="hidden" name="emoji" ref={register} />
                </div>
              </details>
            ))}
          </form>
        </div>
        <input
          type="text"
          name="searchEmoji"
          className="searchEmoji"
          placeholder="検索"
          ref={register}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        />
      </div>
    </Modal>
  );
}
