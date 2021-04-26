import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoginProvider } from "./utils/LoginContext";
import { SocketProvider } from "./utils/SocketContext";
import { HeaderProvider } from "./utils/HeaderContext";
import { NotesProvider } from "./utils/NotesContext";
import { NotificationProvider } from "./utils/NotificationContext";
import { UserPovider } from "./utils/UserContext";
import { NoteDetailsProvider } from "./utils/NoteDetailsContext";
import {
  LogoutModalProvider,
  PostModalProvider,
  ImageModalProvider,
} from "./utils/ModalContext";
import { OverlayProvider } from "./utils/OverlayContext";
import SocketManager from "./utils/SocketManager";
import Modal from "react-modal";
import Auth from "./components/Auth";
import Header from "./components/Header";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import ScrollToTop from "./components/ScrollToTop";
import GeneralOverlay from "./components/GeneralOverlay";
import LogoutModal from "./components/LogoutModal";
import PostModal from "./components/PostModal";
import ImageModal from "./components/ImageModal";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import User from "./pages/User";
import Notification from "./pages/Notification";
import Login from "./pages/Login";
import "./style/style.scss";

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
                      <Route path="/notification">
                        <ScrollToTop />
                        <Notification />
                      </Route>
                      <Route path="/">
                        <Home />
                      </Route>
                    </Switch>
                    <LogoutModal />
                    <ImageModal />
                    <PostModal />
                  </div>
                  <RightBar />
                </div>
                <GeneralOverlay />
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
      <HeaderProvider>
        <NotesProvider>
          <UserPovider>
            <NoteDetailsProvider>
              <NotificationProvider>
                <OverlayProvider>
                  <LogoutModalProvider>
                    <PostModalProvider>
                      <ImageModalProvider>{children}</ImageModalProvider>
                    </PostModalProvider>
                  </LogoutModalProvider>
                </OverlayProvider>
              </NotificationProvider>
            </NoteDetailsProvider>
          </UserPovider>
        </NotesProvider>
      </HeaderProvider>
    </SocketProvider>
  );
}
