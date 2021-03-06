import React, { useReducer } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NotesProvider } from "./utils/NotesContext";
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

const initialState = { isLogin: false };

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLogin: true,
      };
    case "LOGOUT":
      return {
        ...state,
        isLogin: false,
      };
    default:
  }
}

export const LoginContext = React.createContext();

const LoginProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <LoginContext.Provider value={{ state, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
};

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
          </Auth>
        </Switch>
      </Router>
    </LoginProvider>
  );
}
