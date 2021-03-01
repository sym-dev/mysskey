import reactStringReplace from "react-string-replace";

export default function parseMFM(text) {
  text = reactStringReplace(text, /(`{3}(.|\n)*?`{3})/g, (match, i) => (
    <div className="codeBlock" key={match + i}>
      {match.replaceAll("```", "")}
    </div>
  ));
  text = reactStringReplace(text, /(`.*?`)/g, (match, i) => (
    <code key={match + i}>{match.replaceAll("`", "")}</code>
  ));
  return text;
}
