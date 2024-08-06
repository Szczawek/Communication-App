import { useEffect } from "react";
import { loginWithGoogle } from "../../fireConf";
export default function Test() {
  useEffect(() => {
    loginWithGoogle();
  }, []);
  return <div className="test"></div>;
}
