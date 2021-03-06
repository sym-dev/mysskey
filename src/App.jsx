import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NotesProvider } from "./utils/NotesContext";
import { LoginProvider } from "./utils/LoginContext";
import { SocketProvider } from "./utils/SocketContext";
import Modal from "react-modal";
import Auth from "./components/Auth";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./Home";
import Notes from "./Notes";
import User from "./User";
import Login from "./Login";
import "./style.scss";

Modal.setAppElement("#root");

export default function App() {
  return (
    <LoginProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Auth>
            <SocketProvider>
              <NotesProvider>
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
              </NotesProvider>
            </SocketProvider>
          </Auth>
        </Switch>
      </Router>
    </LoginProvider>
  );
}
