import Modal from "react-modal";
import { useLogoutModalContext } from "../utils/ModalContext";

export default function LogoutModal() {
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
        <button className="yes">はい</button>
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
