import TimeLine from "./TimeLine";
import { PostModalProvider } from "./ModalContext";

function Home() {
  return (
    <PostModalProvider>
      <TimeLine />
    </PostModalProvider>
  );
}

export default Home;
