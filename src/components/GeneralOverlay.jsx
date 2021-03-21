import { useOverlayContext } from "../utils/OverlayContext";

export default function GeneralOverlay() {
  const { isOverlayActive, updateOverlay } = useOverlayContext();
  return (
    <div
      className={`generalOverlay ${isOverlayActive ? "active" : "inactive"}`}
      onClick={() => {
        updateOverlay(false);
      }}
    />
  );
}
