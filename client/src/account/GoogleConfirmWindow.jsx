export default function GoogleConfirmWindow() {
  return (
    <div className="google-window">
      <h2>Enter your unqiue name</h2>
      <p>The username is static, you cannot change just the username</p>
      <label htmlFor="set-unqiue-name">
        <input type="text" id="set-unqiue-name" />
      </label>
    </div>
  );
}
