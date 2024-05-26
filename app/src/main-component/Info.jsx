export default function Info({ refreshUser }) {
  return (
    <div className="info">
      <button onClick={() => refreshUser()}>X</button>
      <ul>
        <li>
          <a href="">1</a>
        </li>
        <li>
          <a href="">1</a>
        </li>
        <li>
          <a href="">1</a>
        </li>
        <li>
          <a href="">
            <div className="">
              <img src="" alt="ss" />
            </div>
          </a>
        </li>
        <li>
          <a href="">2</a>
        </li>
      </ul>
    </div>
  );
}
