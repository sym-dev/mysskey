import parseEmojis from "../utils/parseEmojis";
import { twemojify } from "react-twemojify";
import { createImgElement } from "react-twemojify/lib/img";

export default function Reactions(props) {
  const reactions =
    props.data.renoteId && !props.data.text
      ? props.data.renote.reactions
      : props.data.reactions;
  const emojis =
    props.data.renoteId && !props.data.text
      ? props.data.renote.emojis
      : props.data.emojis;
  return (
    <div className="reactionBar">
      {Object.keys(reactions).map((key) => (
        <button key={key}>
          {parseEmojis(twemojify(key, createImgElement), emojis)}
          <span>{reactions[key]}</span>
        </button>
      ))}
    </div>
  );
}
