import reactStringReplace from "react-string-replace";

export default function parseEmojis(text, emojis) {
  emojis.forEach((emoji) => {
    text = reactStringReplace(text, ":" + emoji.name + ":", (match, i) => (
      <img
        key={match + i + Math.floor(Math.random() * (100 - 1) + 1)}
        src={emoji.url}
        alt={emoji.name}
        className="customEmoji"
      />
    ));
  });
  return text;
}
