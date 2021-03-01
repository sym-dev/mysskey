import { Link } from "react-router-dom";
import {
  IoRepeat,
  IoArrowUndo,
  IoGlobeOutline,
  IoHome,
  IoLockClosed,
  IoMail,
  IoFastFood,
} from "react-icons/io5";
import File from "./File";
import parseEmojis from "../utils/parseEmojis";
import parseURL from "../utils/parseURL";
import parseMFM from "../utils/parseMFM";
import { twemojify } from "react-twemojify";
import { createImgElement } from "react-twemojify/lib/img";

export default function Note(props) {
  let data = props.data;
  let depth = props.depth;
  let note = null;
  switch (props.type) {
    case "quote":
      note = (
        <>
          <Note data={data} depth={0} type={"general"} />
          {depth < 1 ? (
            <div className="quote">
              <Note
                data={data.renote}
                depth={1}
                type={
                  !data.renote.renoteId
                    ? "general"
                    : data.renote.text || data.renote.files.length
                    ? "quote"
                    : "renote"
                }
              />
            </div>
          ) : (
            <div className="deepQuoteLink">
              <Link to={"/notes/" + data.renote.id}>RN: ...</Link>
            </div>
          )}
        </>
      );
      break;
    case "renote":
      note = (
        <>
          <div className="noteContainer">
            <div className="smallIcon">
              <img src={data.user.avatarUrl} alt="" />
            </div>
            <div className="noteBody">
              <p className="noteHeader">
                <Link
                  to={
                    !data.user.host
                      ? "/user/@" + data.user.username
                      : "/user/@" + data.user.username + "@" + data.user.host
                  }
                >
                  <IoRepeat fontSize="1.3em" className="renoteIcon renote" />
                  {data.user.name ? data.user.name : data.user.username}
                  <span className="renote"> Renoted</span>
                </Link>
                <span className="noteInfo">
                  <Link to={"/notes/" + data.id} className="createdAt">
                    {getTime(data.createdAt)}
                  </Link>
                  <GetVisibility
                    visibility={data.visibility}
                    local={data.localOnly}
                  />
                </span>
              </p>
            </div>
          </div>
          <Note
            data={data.renote}
            depth={0}
            type={
              !data.renote.renoteId
                ? "general"
                : data.renote.text || data.renote.files.length
                ? "quote"
                : "renote"
            }
          />
        </>
      );
      break;
    case "reply":
      note = (
        <>
          <div className="replyBlock">
            <Note data={data.reply} depth={0} type={"general"} />
          </div>
          <Note data={data} depth={1} type={"general"} />
        </>
      );
      break;

    default:
      note = (
        <div className="noteContainer">
          <div className="icon">
            <img src={data.user.avatarUrl} alt="" width="100" height="100" />
          </div>
          <div className="noteBody">
            <p className="noteHeader">
              <span>
                <Link
                  to={
                    !data.user.host
                      ? "/user/@" + data.user.username
                      : "/user/@" + data.user.username + "@" + data.user.host
                  }
                >
                  {data.user.name ? data.user.name : data.user.username}
                </Link>
                <span>
                  {!data.user.host
                    ? " @" + data.user.username
                    : " @" + data.user.username + "@" + data.user.host}
                </span>
              </span>
              <span className="noteInfo">
                <Link to={"/notes/" + data.id} className="createdAt">
                  {getTime(data.createdAt)}
                </Link>
                <GetVisibility
                  visibility={data.visibility}
                  local={data.localOnly}
                />
              </span>
            </p>
            {data.user.instance && (
              <span
                className="instance"
                style={{
                  backgroundColor: data.user.instance.themeColor,
                  color: "#ffffff",
                }}
              >
                <img src={data.user.instance.faviconUrl} alt="" />
                <p>{data.user.instance.name}</p>
              </span>
            )}
            {data.cw ? (
              <details>
                <summary>{data.cw}</summary>

                <p className="noteText">
                  {data.replyId && <IoArrowUndo />}
                  {parseEmojis(
                    parseURL(parseMFM(twemojify(data.text, createImgElement))),
                    data.emojis
                  )}
                </p>
              </details>
            ) : (
              <div className="noteText">
                {data.replyId && <IoArrowUndo />}
                {parseEmojis(
                  parseURL(parseMFM(twemojify(data.text, createImgElement))),
                  data.emojis
                )}
              </div>
            )}
            {data.files.length <= 0 ? (
              <></>
            ) : (
              <div className="fileContainer" num={data.files.length}>
                {data.files.map((file) => (
                  <File key={file.id} data={file} />
                ))}
              </div>
            )}
          </div>
        </div>
      );
      break;
  }
  return <>{note}</>;
}

function GetVisibility(props) {
  let v = null;
  let l = props.local ? <IoFastFood /> : null;
  switch (props.visibility) {
    case "home":
      v = <IoHome />;
      break;
    case "followers":
      v = <IoLockClosed />;
      break;
    case "specified":
      v = <IoMail />;
      break;
    default:
      v = <IoGlobeOutline />;
      break;
  }
  return (
    <>
      {v}
      {l}
    </>
  );
}

const getTime = (date) => {
  const d = Date.parse(date);
  const n = Date.now();
  const t = n - d;
  if (t < 0) {
    return "未来";
  } else if (t / (365 * 24 * 60 * 60 * 1000) > 1) {
    return (t / (365 * 24 * 60 * 60 * 1000)).toFixed() + "年";
  } else if (t / (24 * 60 * 60 * 1000) > 1) {
    return (t / (24 * 60 * 60 * 1000)).toFixed() + "日";
  } else if (t / (60 * 60 * 1000) > 1) {
    return (t / (60 * 60 * 1000)).toFixed() + "時間";
  } else if (t / (60 * 1000) > 1) {
    return (t / (60 * 1000)).toFixed() + "分";
  } else {
    return (t / 1000).toFixed() + "秒";
  }
};
