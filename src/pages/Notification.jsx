import { useEffect } from "react";
import { IoNotifications } from "react-icons/io5";
import { useHeaderContext } from "../utils/HeaderContext";
import Notifications from "../components/Notifications";

export default function Notification() {
  const { updateHeaderValue } = useHeaderContext();
  useEffect(() => {
    updateHeaderValue(
      <>
        <IoNotifications fontSize="1.2em" />
        Notification
      </>
    );
  }, [updateHeaderValue]);
  return (
    <div id="notification">
      <Notifications />
    </div>
  );
}
