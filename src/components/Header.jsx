import { useHeaderContext } from "../utils/HeaderContext";

export default function Header() {
  const { headerValue } = useHeaderContext();
  return <header className="top-header">{headerValue}</header>;
}
