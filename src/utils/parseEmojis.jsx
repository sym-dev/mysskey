import reactStringReplace from "react-string-replace";
import { parse } from "twemoji-parser";

export default function parseEmojis(text, emojis) {
  const twemoji = parse(text);
  twemoji.forEach((emoji) => {
    text = reactStringReplace(text, emoji.text, (match, i) => (
      <img
        key={match + i}
        src={emoji.url}
        alt={emoji.text}
        className="twemoji"
      />
    ));
  });
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
