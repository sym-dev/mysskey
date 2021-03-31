import { useState, createContext, useContext } from "react";

const LogoutModalContext = createContext();

const ImageModalContext = createContext();

const PostModalContext = createContext();

const LogoutModalProvider = ({ children }) => {
  const [logoutModal, updateLogoutModal] = useState(false);
  return (
    <LogoutModalContext.Provider value={{ logoutModal, updateLogoutModal }}>
      {children}
    </LogoutModalContext.Provider>
  );
};

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

const useLogoutModalContext = () => useContext(LogoutModalContext);
const useImageModalContext = () => useContext(ImageModalContext);
const usePostModalContext = () => useContext(PostModalContext);

export {
  LogoutModalProvider,
  ImageModalProvider,
  PostModalProvider,
  useLogoutModalContext,
  useImageModalContext,
  usePostModalContext,
};
