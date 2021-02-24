import {
  IoRepeat,
  IoArrowUndo,
  IoBan,
  IoAddCircle,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { useRenoteModalContext, usePostModalContext } from "../ModalContext";

export default function NoteFooter(props) {
  const data = props.data;
  const actualData = !props.data.renoteId ? props.data : props.data.renote;
  const { updateRenoteModal, updateRenoteProp } = useRenoteModalContext();
  const { updatePostModal, updatePostProp } = usePostModalContext();
  return (
    <footer className="noteFooter">
      <div>
        <button
          onClick={() => {
            updatePostModal(true);
            updatePostProp(data);
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
              updateRenoteModal(true);
              updateRenoteProp(data);
            }}
          >
            <IoRepeat fontSize="1.2em" />
          </button>
          <span>{actualData.renoteCount}</span>
        </div>
      )}
      <div>
        <button>
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
