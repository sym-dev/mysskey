import { useImageModalContext } from "../ModalContext";

export default function File({ data }) {
  const { updateImageModal, updateImageProp } = useImageModalContext();
  let file = null;
  if (/^image/.exec(data.type)) {
    file = (
      <>
        <div className="imageBlock">
          <img
            src={data.thumbnailUrl}
            alt={data.comment}
            decoding="async"
            onClick={() => {
              updateImageModal(true);
              updateImageProp({
                URL: data.url,
                Comment: data.comment,
              });
              console.log(data.url + " , " + data.comment);
            }}
          />
        </div>
      </>
    );
  } else if (/^audio/.exec(data.type)) {
    file = (
      <audio src={data.url} title={data.name} preload="metadata" controls />
    );
  }
  return <>{file}</>;
}
