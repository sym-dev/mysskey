import reactStringReplace from "react-string-replace";

export default function parseURL(text) {
  text = reactStringReplace(text, /(<?https?:\/\/\S+)/g, (match, i) => (
    <a
      key={match.replace(">", "").replace("<", "") + i}
      href={match.replace(">", "").replace("<", "")}
      target="_blank"
      rel="noreferrer"
    >
      {decodeURI(match.replace(">", "").replace("<", ""))}
    </a>
  ));
  return text;
}
