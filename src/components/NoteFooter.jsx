import {
  IoRepeat,
  IoArrowUndo,
  IoBan,
  IoAddCircle,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { useRenoteModalContext } from "../ModalContext";

export default function NoteFooter(props) {
  let data = props.data;
  const { updateRenoteModal, updateRenoteProp } = useRenoteModalContext();
  return (
    <footer className="noteFooter">
      <button>
        <IoArrowUndo fontSize="1.5em" />
      </button>

      {data.visibility === "specified" || data.visibility === "followers" ? (
        <button disabled>
          <IoBan fontSize="1.5em" />
        </button>
      ) : (
        <>
          <button
            onClick={() => {
              updateRenoteModal(true);
              updateRenoteProp(data);
            }}
          >
            <IoRepeat fontSize="1.5em" />
          </button>
        </>
      )}

      <button>
        <IoAddCircle fontSize="1.5em" />
      </button>
      <button>
        <IoEllipsisHorizontal fontSize="1.5em" />
      </button>
    </footer>
  );
}
