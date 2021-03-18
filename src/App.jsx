import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoginProvider } from "./utils/LoginContext";
import { SocketProvider } from "./utils/SocketContext";
import { NotesProvider } from "./utils/NotesContext";
import { NotificationProvider } from "./utils/NotificationContext";
import {
  PostModalProvider,
  EmojiModalProvider,
  ImageModalProvider,
} from "./utils/ModalContext";
import SocketManager from "./utils/SocketManager";
import Modal from "react-modal";
import Auth from "./components/Auth";
import Header from "./components/Header";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
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
            <div id="login">
              <Login />
            </div>
          </Route>
          <Auth>
            <Providers>
              <SocketManager>
                <div id="wrapper">
                  <LeftBar />
                  <div id="center">
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
                  </div>
                  <RightBar />
                </div>
              </SocketManager>
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
        <NotificationProvider>
          <PostModalProvider>
            <EmojiModalProvider>
              <ImageModalProvider>{children}</ImageModalProvider>
            </EmojiModalProvider>
          </PostModalProvider>
        </NotificationProvider>
      </NotesProvider>
    </SocketProvider>
  );
}
