import { useEffect } from "react";
import { IoHome } from "react-icons/io5";
import { useHeaderContext } from "../utils/HeaderContext";
import TimeLine from "./TimeLine";

function Home() {
  const { updateHeaderValue } = useHeaderContext();
  useEffect(() => {
    updateHeaderValue(
      <>
        <IoHome fontSize="1.2em" />
        TimeLine
      </>
    );
  }, [updateHeaderValue]);
  return <TimeLine />;
}

export default Home;
