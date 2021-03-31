import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { useLoginContext } from "../utils/LoginContext";
import { useLogoutModalContext } from "../utils/ModalContext";

export default function LogoutModal() {
  const history = useHistory();
  const { updateLogin } = useLoginContext();
  const { logoutModal, updateLogoutModal } = useLogoutModalContext();
  return (
    <Modal
      isOpen={logoutModal}
      onRequestClose={() => {
        updateLogoutModal(false);
      }}
      className="modal logoutModal"
      overlayClassName="Overlay"
    >
      <p>ログアウトしますか？</p>
      <div>
        <button
          className="yes"
          onClick={() => {
            localStorage.clear();
            updateLogin(false);
            history.push("/login");
          }}
        >
          はい
        </button>
        <button
          onClick={() => {
            updateLogoutModal(false);
          }}
        >
          いいえ
        </button>
      </div>
    </Modal>
  );
}
