import { IoPencil } from "react-icons/io5";
import { usePostModalContext } from "../utils/ModalContext";

export default function LeftBar() {
  const { updatePostModal } = usePostModalContext();
  return (
    <div className="side" id="left">
      <button
        className="post-button"
        onClick={() => {
          updatePostModal(true);
        }}
      >
        <IoPencil fontSize="2em" />
      </button>
    </div>
  );
}
