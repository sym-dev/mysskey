import {
  IoRepeat,
  IoArrowUndo,
  IoBan,
  IoAddCircle,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import {
  usePostModalContext,
  useEmojiModalContext,
} from "../utils/ModalContext";
// import { useSocketContext } from "../utils/SocketContext";

export default function NoteFooter({ data }) {
  // const { socketRef } = useSocketContext();
  const actualData = data.renoteId && !data.text ? data.renote : data;
  const {
    updatePostModal,
    updateReplyProp,
    updateRenoteProp,
  } = usePostModalContext();
  const {
    updateEmojiModal,
    updateNoteId,
    updateEmojiModalPlace,
  } = useEmojiModalContext();
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
      <div>
        <button
          onClick={(e) => {
            updateEmojiModal(true);
            updateNoteId(actualData.id);
            updateEmojiModalPlace({
              x: e.clientX,
              y:
                e.view.outerHeight - e.clientY > 400
                  ? e.clientY
                  : e.clientY - 350,
            });
          }}
        >
          <IoAddCircle fontSize="1.2em" />
        </button>
      </div>
      <div>
        <button>
          <IoEllipsisHorizontal fontSize="1.2em" />
        </button>
      </div>
    </footer>
  );
}
