import TimeLine from "./TimeLine";
import { PostModalProvider } from "./utils/ModalContext";

function Home() {
  return (
    <PostModalProvider>
      <TimeLine />
    </PostModalProvider>
  );
}

export default Home;
