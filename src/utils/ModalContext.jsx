import { useState, createContext, useContext } from "react";

const ImageModalContext = createContext();

const PostModalContext = createContext();

const EmojiModalContext = createContext();

const ImageModalProvider = ({ children }) => {
  const [imageModal, updateImageModal] = useState(false);
  const [imageProp, updateImageProp] = useState({
    URL: "",
    Comment: "",
  });

  return (
    <ImageModalContext.Provider
      value={{ imageModal, updateImageModal, imageProp, updateImageProp }}
    >
      {children}
    </ImageModalContext.Provider>
  );
};

const PostModalProvider = ({ children }) => {
  const [postModal, updatePostModal] = useState(false);
  const [replyProp, updateReplyProp] = useState(false);
  const [renoteProp, updateRenoteProp] = useState(false);
  return (
    <PostModalContext.Provider
      value={{
        postModal,
        updatePostModal,
        replyProp,
        updateReplyProp,
        renoteProp,
        updateRenoteProp,
      }}
    >
      {children}
    </PostModalContext.Provider>
  );
};

const EmojiModalProvider = ({ children }) => {
  const [emojiModal, updateEmojiModal] = useState(false);
  const [emojiModalPlace, updateEmojiModalPlace] = useState({});
  const [noteId, updateNoteId] = useState("");
  return (
    <EmojiModalContext.Provider
      value={{
        emojiModal,
        updateEmojiModal,
        emojiModalPlace,
        updateEmojiModalPlace,
        noteId,
        updateNoteId,
      }}
    >
      {children}
    </EmojiModalContext.Provider>
  );
};

const useImageModalContext = () => useContext(ImageModalContext);
const usePostModalContext = () => useContext(PostModalContext);
const useEmojiModalContext = () => useContext(EmojiModalContext);

export {
  ImageModalProvider,
  PostModalProvider,
  EmojiModalProvider,
  useImageModalContext,
  usePostModalContext,
  useEmojiModalContext,
};
