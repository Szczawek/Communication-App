export default function Profile({ user, loggedInUser }) {
  const { nick, avatar, unqiueName, id, baner } = user;
  return (
    <div className="profile">
      <div className="baner">
        <img src={baner} alt="baner" />
        <div className="circle">
          <div className="avatar">
            <img
              className="profile_img"
              src={!avatar ? "./images/user.jpg" : avatar}
              alt="avatar"
            />
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="profile_info">
          <p className="nick">{nick}</p>
          <p className="unqiue-name">{unqiueName}</p>
        </div>
        {loggedInUser["id"] === id ? null : loggedInUser["friends"].includes(
            id
          ) ? (
          <button>Remove</button>
        ) : (
          <button>Add</button>
        )}
      </div>
    </div>
  );
}
