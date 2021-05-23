import { useState } from "react";
import { useImageModalContext } from "../utils/ModalContext";
import { IoEyeOff } from "react-icons/io5";

export default function File({ data }) {
  const { updateImageModal, updateImageProp } = useImageModalContext();
  const [NSFWstate, updateNSFWstate] = useState(data.isSensitive);
  let file = null;
  if (/^image/.exec(data.type)) {
    file = (
      <>
        <div className="imageBlock">
          <div className={"NSFWimage" + (NSFWstate ? " NSFWbg" : "")}>
            {NSFWstate && <p>閲覧注意(クリックで表示)</p>}
            {!NSFWstate && (
              <button
                onClick={() => {
                  updateNSFWstate(true);
                }}
              >
                <IoEyeOff fontSize="1.2em" />
              </button>
            )}
            <img
              src={data.thumbnailUrl}
              alt={data.comment}
              decoding="async"
              className={NSFWstate ? "NSFW" : ""}
              onClick={() => {
                if (NSFWstate) {
                  updateNSFWstate(false);
                } else {
                  updateImageModal(true);
                  updateImageProp({
                    URL: data.url,
                    Comment: data.comment,
                  });
                }
              }}
            />
          </div>
        </div>
      </>
    );
  } else if (/^audio/.exec(data.type)) {
    file = (
      <audio src={data.url} title={data.name} preload="metadata" controls />
    );
  } else if (/^video/.exec(data.type)) {
    file = (
      <video title={data.name} controls preload="metadata">
        <source src={data.url} type={data.type} />
        埋め込み動画に対応していないようです
      </video>
    );
  }
  return <>{file}</>;
}
