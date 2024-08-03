import { useContext } from "react";
import { UserFunctions } from "../App";

export default function EditProfile() {
  const { avatar, banner } = useContext(UserFunctions)["loggedInUser"];
  console.log(avatar);
  async function editImages() {
    const fetchOptions = {
      method: "POST",
      headers: {},
    };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL}/edit-images`,
        fetchOptions
      );
    } catch (err) {
      console.error(`Error with editing images: ${err}`);
    }
  }
  return (
    <div className="edit-profile-window">
      <label className="banner">
        <img src={banner} alt="banner" htmlFor="new-banner" />
        <input type="file" name="" id="new-banner" />
      </label>
      <label className="avatar" htmlFor="new-avatar">
        <img src={avatar} alt="avatar" />
        <input
          onChange={(e) => {
            const imgAsfile = e.target.files[0];
            const formForImg = new FormData();
            const asBlob = new Blob([imgAsfile], {
              type: imgAsfile.type,
            });
            formForImg.append("new-img", asBlob);
            test();
            async function test() {
              const res = await fetch(
                `${import.meta.env.VITE_URL}/edit-images`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    token: sessionStorage.getItem("session"),
                  },
                  body: formForImg,
                }
              );
              if (!res.ok) console.error("error");
              console.log("ok");
            }
          }}
          type="file"
          name=""
          id="new-avatar"
        />
      </label>
    </div>
  );
}
