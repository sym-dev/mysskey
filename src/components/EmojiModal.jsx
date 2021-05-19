import { useForm } from "react-hook-form";
import { useSocketContext } from "../utils/SocketContext";
import { useOverlayContext } from "../utils/OverlayContext";
import { IoCheckmark, IoTime } from "react-icons/io5";

export default function EmojiModal(props) {
  const { updateOverlay } = useOverlayContext();
  let RUEmoji = Array.isArray(JSON.parse(localStorage.getItem("RUEmoji")))
    ? JSON.parse(localStorage.getItem("RUEmoji"))
    : [];
  const customEmojis = JSON.parse(localStorage.getItem("meta")).emojis;
  const emojiCategory = [...new Set(customEmojis.map((item) => item.category))];
  const { socketRef } = useSocketContext();
  const { register, watch, handleSubmit, setValue } = useForm();
  const search = watch("searchEmoji");
  const onSubmitReaction = (data) => {
    if (props.type === "reaction") {
      const createReactionObject = {
        type: "api",
        body: {
          id: "reaction",
          endpoint: "notes/reactions/create",
          data: {
            i: localStorage.getItem("UserToken"),
            noteId: props.noteId,
            reaction: data.reaction ? data.reaction : ":" + data.emoji + ":",
          },
        },
      };
      socketRef.current.send(JSON.stringify(createReactionObject));
    } else if (props.type === "emoji") {
      props.addEmoji(data.reaction ? data.reaction : ":" + data.emoji + ":");
    }
    props.fn(false);
    updateOverlay(false);
  };
  return (
    <div
      className={`modal emojiModal ${props.isActive ? "active" : "inactive"}`}
      style={{
        top: props.y,
      }}
    >
      <form onSubmit={handleSubmit(onSubmitReaction)}>
        <div className="userInput">
          <input
            type="text"
            {...register("reaction")}
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
            <input type="hidden" {...register("emoji")} />
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
              <input type="hidden" {...register("emoji")} />
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
                  <input type="hidden" {...register("emoji")} />
                </div>
              </details>
            ))}
          </form>
        </div>
        <input
          type="text"
          {...register("searchEmoji")}
          className="searchEmoji"
          placeholder="検索"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        />
      </div>
    </div>
  );
}
