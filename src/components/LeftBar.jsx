import { IoHome, IoNotifications, IoPencil, IoPower } from "react-icons/io5";
import { Link } from "react-router-dom";
import { usePostModalContext } from "../utils/ModalContext";
import { useLogoutModalContext } from "../utils/ModalContext";

export default function LeftBar() {
  const { updateLogoutModal } = useLogoutModalContext();
  const { updatePostModal } = usePostModalContext();
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user);
  return (
    <div className="side" id="left">
      <div className="upper">
        <Link to="/" className="item">
          <IoHome fontSize="1.2em" />
          <label>タイムライン</label>
        </Link>
        <Link to="/notification" className="item">
          <IoNotifications fontSize="1.2em" />
          <label>通知</label>
        </Link>
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
