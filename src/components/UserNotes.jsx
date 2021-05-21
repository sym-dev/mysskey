import React, { useState, useEffect, useRef } from "react";
import { IoPin } from "react-icons/io5";
import { ImageModalProvider } from "../utils/ModalContext";
import { useSocketContext } from "../utils/SocketContext";
import { useUserContext } from "../utils/UserContext";
import { InView, useInView } from "react-intersection-observer";
import Note from "./Note";
import ImageModal from "./ImageModal";
import Loading from "./Loading";
import Reactions from "./Reactions";
import NoteFooter from "./NoteFooter";

export default function UserNotes() {
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
  });
  const dontEffect = useRef(false);
  const settings = useRef(JSON.parse(localStorage.getItem("settings")));
  const {
    userInfo,
    userNotes,
    updateUserNotes,
    oldestUserNoteId,
    moreUserNote,
    updateMoreUserNote,
    isLastUserNote,
  } = useUserContext();
  const { socketRef } = useSocketContext();
  const [includeReply, updateIncludeReply] = useState(false);
  useEffect(() => {
    dontEffect.current = true;
  }, [oldestUserNoteId, userInfo, includeReply, settings]);
  useEffect(() => {
    if (settings.current.auto_motto) {
      if (dontEffect.current) {
        dontEffect.current = false;
      } else {
        if (entry && entry.isIntersecting) {
          updateMoreUserNote(true);
          socketRef.current.send(
            JSON.stringify({
              type: "api",
              body: {
                id: "moreUserNotes",
                endpoint: "users/notes",
                data: {
                  i: localStorage.getItem("UserToken"),
                  userId: userInfo.id,
                  includeReplies: includeReply,
                  limit: 15,
                  untilId: oldestUserNoteId,
                },
              },
            })
          );
        }
      }
    }
  }, [
    inView,
    entry,
    oldestUserNoteId,
    socketRef,
    updateMoreUserNote,
    includeReply,
    userInfo,
  ]);
  return (
    <>
      {userInfo && (
        <InView>
          <ImageModalProvider>
            <main>
              {userInfo.pinnedNotes.length > 0 && (
                <div className="pinned-posts">
                  <p>
                    <IoPin fontSize="1.2em" />
                    ピン止めされた投稿
                  </p>
                  {userInfo.pinnedNotes.map((data) => (
                    <div key={data.id} className="note">
                      <Note
                        data={data}
                        depth={0}
                        type={
                          data.renoteId && !data.text
                            ? "renote"
                            : data.renoteId
                            ? "quote"
                            : data.replyId
                            ? "reply"
                            : "generall"
                        }
                      />
                      <Reactions data={data} />
                      <NoteFooter data={data} />
                    </div>
                  ))}
                </div>
              )}
            </main>
            <section className="userNotes">
              <nav className="noteNav">
                <ul>
                  <li
                    className={!includeReply ? "active" : ""}
                    onClick={() => {
                      if (includeReply) {
                        updateUserNotes(false);
                        updateIncludeReply(false);
                        const userNoteObject = {
                          type: "api",
                          body: {
                            id: "userNotes",
                            endpoint: "users/notes",
                            data: {
                              i: localStorage.getItem("UserToken"),
                              userId: userInfo.id,
                              includeReplies: false,
                              limit: 15,
                            },
                          },
                        };
                        socketRef.current.send(JSON.stringify(userNoteObject));
                      }
                    }}
                  >
                    投稿
                  </li>
                  <li
                    className={includeReply ? "active" : ""}
                    onClick={() => {
                      if (!includeReply) {
                        updateUserNotes(false);
                        updateIncludeReply(true);
                        const userNoteObject = {
                          type: "api",
                          body: {
                            id: "userNotes",
                            endpoint: "users/notes",
                            data: {
                              i: localStorage.getItem("UserToken"),
                              userId: userInfo.id,
                              includeReplies: true,
                              limit: 15,
                            },
                          },
                        };
                        socketRef.current.send(JSON.stringify(userNoteObject));
                      }
                    }}
                  >
                    投稿と返信
                  </li>
                </ul>
              </nav>
              {userNotes && (
                <main>
                  {userNotes.map((data) => (
                    <div key={data.id} className="note">
                      <Note
                        data={data}
                        depth={0}
                        type={
                          data.renoteId && !data.text
                            ? "renote"
                            : data.renoteId
                            ? "quote"
                            : data.replyId
                            ? "reply"
                            : "generall"
                        }
                      />
                      <Reactions data={data} />
                      <NoteFooter data={data} />
                    </div>
                  ))}
                  {!isLastUserNote && (
                    <button
                      className="motto"
                      ref={ref}
                      onClick={() => {
                        socketRef.current.send(
                          JSON.stringify({
                            type: "api",
                            body: {
                              id: "moreUserNotes",
                              endpoint: "users/notes",
                              data: {
                                i: localStorage.getItem("UserToken"),
                                userId: userInfo.id,
                                includeReplies: false,
                                limit: 15,
                                untilId: oldestUserNoteId,
                              },
                            },
                          })
                        );
                        updateMoreUserNote(true);
                      }}
                    >
                      {moreUserNote ? <Loading size="small" /> : "もっと"}
                    </button>
                  )}
                </main>
              )}
            </section>
            <ImageModal />
          </ImageModalProvider>
        </InView>
      )}
    </>
  );
}
