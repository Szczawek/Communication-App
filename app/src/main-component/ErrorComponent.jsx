import "./errorComponent.css";

export default function ErrorComponent() {
  return (
    <div className="error-box">
      <header className="desc">
        <h1>There is a problem with server</h1>
        <p>Sorry for the inconvenience, we will fix it soon!</p>
        <p className="dots"> . . .</p>
      </header>
    </div>
  );
}
