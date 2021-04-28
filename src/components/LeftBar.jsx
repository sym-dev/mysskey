import {
  IoArchive,
  IoHome,
  IoNotifications,
  IoPencil,
  IoPower,
  IoSettings,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import { useNotesContext } from "../utils/NotesContext";
import { usePostModalContext } from "../utils/ModalContext";
import { useLogoutModalContext } from "../utils/ModalContext";

export default function LeftBar() {
  const { notes, dispatch, updateOldestNote } = useNotesContext();
  const { updateLogoutModal } = useLogoutModalContext();
  const { updatePostModal } = usePostModalContext();
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  return (
    <div className="side" id="left">
      <div className="upper">
        <Link
          to="/"
          className="item"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <IoHome fontSize="1.2em" />
          <label>タイムライン</label>
        </Link>
        <Link
          to="/notification"
          className="item"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <IoNotifications fontSize="1.2em" />
          <label>通知</label>
        </Link>
        <Link
          to="/settings"
          className="item"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <IoSettings fontSize="1.2em" />
          <label>設定</label>
        </Link>
        <span
          className="item clean"
          onClick={() => {
            dispatch({
              type: "clear",
            });
            updateOldestNote(notes[9].id);
          }}
        >
          <IoArchive fontSize="1.2em" />
          <label>クリア</label>
        </span>
        <span
          className="item logout"
          onClick={() => {
            updateLogoutModal(true);
          }}
        >
          <IoPower />
          <label>ログアウト</label>
        </span>
      </div>
      <div className="lower">
        <div className="Me">
          <Link to={"/user/@" + user.username}>
            <img
              src={user.avatarUrl}
              alt={user.name ? user.name : user.username}
            />
            <label>{localStorage.getItem("UserName")}</label>
          </Link>
        </div>
        <button
          className="post-button"
          onClick={() => {
            updatePostModal(true);
          }}
        >
          <IoPencil fontSize="2em" />
        </button>
      </div>
    </div>
  );
}
