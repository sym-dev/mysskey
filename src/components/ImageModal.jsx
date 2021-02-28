import { useImageModalContext } from "../utils/ModalContext";
import { IoCloseCircle } from "react-icons/io5";
import Modal from "react-modal";

export default function ImageModal() {
  const { imageModal, updateImageModal, imageProp } = useImageModalContext();
  return (
    <Modal
      isOpen={imageModal}
      onRequestClose={() => updateImageModal(false)}
      className="imgModal"
      overlayClassName="Overlay"
    >
      <IoCloseCircle
        fontSize="3em"
        className="close"
        onClick={() => updateImageModal(false)}
      />
      <img
        src={imageProp.URL}
        alt={imageProp.Comment}
        decoding="async"
        onClick={() => updateImageModal(false)}
      />
    </Modal>
  );
}
