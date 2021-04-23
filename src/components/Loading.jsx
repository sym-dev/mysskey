import { IoMusicalNotesOutline } from "react-icons/io5";

export default function Loading(props) {
  return (
    <div className="loading">
      <IoMusicalNotesOutline
        fontSize={props.size === "small" ? "1.5em" : "3em"}
        className="ion-icon"
      />
    </div>
  );
}
