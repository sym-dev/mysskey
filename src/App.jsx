import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoginProvider } from "./utils/LoginContext";
import { SocketProvider } from "./utils/SocketContext";
import { NotesProvider } from "./utils/NotesContext";
import {
  PostModalProvider,
  EmojiModalProvider,
  ImageModalProvider,
} from "./utils/ModalContext";
import Modal from "react-modal";
import Auth from "./components/Auth";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import PostModal from "./components/PostModal";
import EmojiModal from "./components/EmojiModal";
import ImageModal from "./components/ImageModal";
import Home from "./Home";
import Notes from "./Notes";
import User from "./User";
import Login from "./Login";
import "./style.scss";

export default function App() {
  Modal.setAppElement("#root");
  return (
    <LoginProvider>
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Auth>
            <Providers>
              <Header />
              <Switch>
                <Route path="/notes">
                  <ScrollToTop />
                  <Notes />
                </Route>
                <Route path="/user">
                  <ScrollToTop />
                  <User />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
              <EmojiModal />
              <ImageModal />
              <PostModal />
            </Providers>
          </Auth>
        </Switch>
      </Router>
    </LoginProvider>
  );
}

function Providers({ children }) {
  return (
    <SocketProvider>
      <NotesProvider>
        <PostModalProvider>
          <EmojiModalProvider>
            <ImageModalProvider>{children}</ImageModalProvider>
          </EmojiModalProvider>
        </PostModalProvider>
      </NotesProvider>
    </SocketProvider>
  );
}
