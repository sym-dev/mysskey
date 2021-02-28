import reactStringReplace from "react-string-replace";

export default function parseEmojis(text, emojis) {
  emojis.forEach((emoji) => {
    text = reactStringReplace(text, ":" + emoji.name + ":", (match, i) => (
      <img key={match + i} src={emoji.url} alt={emoji.name} className="emoji" />
    ));
  });
  return text;
}
