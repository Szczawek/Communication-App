import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function reqLoginAccount(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        email,
        password,
      };
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const res = await fetch(
        `${import.meta.env.VITE_URL}/login`,
        fetchOptions
      );
      setLoading(false);
      if (!res.ok) return console.error(`Error with login: ${res.status}}`);
      navigate("/");
    } catch (err) {
      throw Error(`Error durning login to account: ${err}`);
    }
  }
  return (
    <div className="login">
      <form onSubmit={(e) => reqLoginAccount(e)}>
        <header>
          <h2>Login</h2>
        </header>
        <label htmlFor="login-ac">
          <input
            required
            placeholder="email"
            id="login-ac"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </label>
        <label htmlFor="password-ac">
          <input
            required
            placeholder="password-ac"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </label>
        <button type="submit">{loading ? "loading..." : "Submit"}</button>
      </form>
    </div>
  );
}
