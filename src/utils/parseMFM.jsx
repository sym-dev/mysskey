import reactStringReplace from "react-string-replace";

export default function parseMFM(text) {
  text = reactStringReplace(text, /(`{3}(.|\n)*?`{3})/g, (match) => (
    <div className="codeBlock">{match.replaceAll("```", "")}</div>
  ));
  text = reactStringReplace(text, /(`.*?`)/g, (match) => (
    <code>{match.replaceAll("`", "")}</code>
  ));
  return text;
}
