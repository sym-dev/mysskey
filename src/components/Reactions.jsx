import parseEmojis from "../utils/parseEmojis";

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
          {parseEmojis(key, emojis)}
          <span>{reactions[key]}</span>
        </button>
      ))}
    </div>
  );
}
