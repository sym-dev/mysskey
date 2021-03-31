import React from "react";
import { Link } from "react-router-dom";
import { parse } from "twemoji-parser";
import * as mfm from "mfm-js";

export default function parseMFM(text, emojis, type) {
  let v = [];
  if (text) {
    switch (type) {
      case "full":
        mfm.parse(text).forEach((data, i) => {
          v.push(
            <React.Fragment key={i}>{judge(data, emojis)}</React.Fragment>
          );
        });
        break;
      case "plain":
        mfm.parsePlain(text).forEach((data, i) => {
          v.push(
            <React.Fragment key={i}>{judgePlain(data, emojis)}</React.Fragment>
          );
        });
        break;
      default:
        break;
    }
  } else {
    v = text;
  }
  return v;
}

function judge(data, emojis) {
  let c = [];
  switch (data.type) {
    case "text":
      return data.props.text;
    case "fn":
      data.children.forEach((child, i) => {
        c.push(<React.Fragment key={i}>{judge(child, emojis)}</React.Fragment>);
      });
      return <span className={data.props.name}>{c}</span>;
    case "link":
      return (
        <a href={data.props.url} target="_blank" rel="noreferrer">
          {data.children[0].props.text}
        </a>
      );
    case "url":
      return (
        <a href={data.props.url} target="_blank" rel="noreferrer">
          {data.props.url}
        </a>
      );
    case "hashtag":
      return (
        <Link to={""} className="hashtag">
          {"#" + data.props.hashtag}
        </Link>
      );
    case "mention":
      return (
        <Link to={"/user/" + data.props.acct} className="mention">
          {data.props.acct}
        </Link>
      );
    case "mathInline":
      return <span className="mathInline">{data.props.formula}</span>;
    case "inlineCode":
      return <code>{data.props.code}</code>;
    case "strike":
      data.children.forEach((child, i) => {
        c.push(<React.Fragment key={i}>{judge(child, emojis)}</React.Fragment>);
      });
      return <s>{c}</s>;
    case "italic":
      data.children.forEach((child, i) => {
        c.push(<React.Fragment key={i}>{judge(child, emojis)}</React.Fragment>);
      });
      return <span className="italic">{c}</span>;
    case "small":
      data.children.forEach((child, i) => {
        c.push(<React.Fragment key={i}>{judge(child, emojis)}</React.Fragment>);
      });
      return <span className="small">{c}</span>;
    case "bold":
      data.children.forEach((child, i) => {
        c.push(<React.Fragment key={i}>{judge(child, emojis)}</React.Fragment>);
      });
      return <span className="bold">{c}</span>;
    case "unicodeEmoji":
      const twemoji = parse(data.props.emoji);
      return (
        <img
          src={twemoji[0].url}
          alt={twemoji[0].text}
          className="twemoji"
          decoding="async"
        />
      );
    case "emojiCode":
      return emojis && emojis.length > 0 ? (
        <img
          src={emojis.find(({ name }) => name === data.props.name).url}
          alt={data.props.name}
          className="customEmoji"
          decoding="async"
        />
      ) : (
        ":" + data.props.name + ":"
      );
    case "quote":
      data.children.forEach((child, i) => {
        c.push(<React.Fragment key={i}>{judge(child, emojis)}</React.Fragment>);
      });
      return <blockquote className="quoteText">{c}</blockquote>;
    case "search":
      return (
        <div className="searchBlock">
          <input
            type="text"
            className="field"
            value={data.props.query}
            readOnly
          />
          <input
            type="button"
            value="検索"
            onClick={() => {
              window.open(
                `https://www.google.com/search?q=${data.props.query}`
              );
            }}
          />
        </div>
      );
    case "blockCode":
      return <pre lang={data.props.lang}>{data.props.code}</pre>;
    case "mathBlock":
      return <div className="mathBlock">{data.props.formula}</div>;
    case "center":
      data.children.forEach((child, i) => {
        c.push(<React.Fragment key={i}>{judge(child, emojis)}</React.Fragment>);
      });
      return <div className="centerText">{c}</div>;
    default:
      break;
  }
}

function judgePlain(data, emojis) {
  switch (data.type) {
    case "text":
      return data.props.text;
    case "unicodeEmoji":
      const twemoji = parse(data.props.emoji);
      return (
        <img
          src={twemoji[0].url}
          alt={twemoji[0].text}
          className="twemoji"
          decoding="async"
        />
      );
    case "emojiCode":
      return (
        <img
          src={emojis.find(({ name }) => name === data.props.name).url}
          alt={data.props.name}
          className="customEmoji"
          decoding="async"
        />
      );
    default:
      break;
  }
}
