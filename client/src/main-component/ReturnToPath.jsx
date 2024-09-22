import { Navigate } from "react-router-dom";

export default function ReturnToPath({path}) {
  return <Navigate to={path} />;
}
