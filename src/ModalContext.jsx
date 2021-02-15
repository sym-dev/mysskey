import { useState, createContext, useContext } from "react";

const ImageModalContext = createContext();

const RenoteModalContext = createContext();

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

const useImageModalContext = () => useContext(ImageModalContext);
const useRenoteModalContext = () => useContext(RenoteModalContext);

export {
  ImageModalProvider,
  RenoteModalProvider,
  useImageModalContext,
  useRenoteModalContext,
};
