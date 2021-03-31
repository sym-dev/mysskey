import TimeLine from "./TimeLine";
import { useHeaderContext } from "../utils/HeaderContext";
import { IoHome } from "react-icons/io5";
import { useEffect } from "react";

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
