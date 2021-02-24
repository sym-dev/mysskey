import { useState, createContext, useContext } from "react";

const ImageModalContext = createContext();

const RenoteModalContext = createContext();

const PostModalContext = createContext();

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

const RenoteModalProvider = ({ children }) => {
  const [renoteModal, updateRenoteModal] = useState(false);
  const [renoteProp, updateRenoteProp] = useState({});
  return (
    <RenoteModalContext.Provider
      value={{ renoteModal, updateRenoteModal, renoteProp, updateRenoteProp }}
    >
      {children}
    </RenoteModalContext.Provider>
  );
};

const PostModalProvider = ({ children }) => {
  const [postModal, updatePostModal] = useState(false);
  const [postProp, updatePostProp] = useState("");
  return (
    <PostModalContext.Provider
      value={{ postModal, updatePostModal, postProp, updatePostProp }}
    >
      {children}
    </PostModalContext.Provider>
  );
};

const useImageModalContext = () => useContext(ImageModalContext);
const useRenoteModalContext = () => useContext(RenoteModalContext);
const usePostModalContext = () => useContext(PostModalContext);

export {
  ImageModalProvider,
  RenoteModalProvider,
  PostModalProvider,
  useImageModalContext,
  useRenoteModalContext,
  usePostModalContext,
};
