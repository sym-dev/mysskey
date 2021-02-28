import reactStringReplace from "react-string-replace";

export default function parseMFM(text) {
  text = reactStringReplace(text, /(`.*?`)/g, (match) => (
    <code>{match.replaceAll("`", "")}</code>
  ));
  return text;
}
