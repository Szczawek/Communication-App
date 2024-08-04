import { useContext, useState } from "react";
import { UserFunctions } from "../App";
import imageCompression from "browser-image-compression";

export default function EditProfile() {
  const { avatar, banner } = useContext(UserFunctions)["loggedInUser"];
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState({
    avatar,
    banner,
  });
  const [imagesAsBlob, setImagesAsBlob] = useState([]);
  async function sendEditedImage() {
    try {
      const form = new FormData();
      const copy = [...imagesAsBlob];
      for (const obj of copy) {
        const type = Object.keys(obj)[0];
        form.append(type, obj[type]);
      }

      const fetchOption = {
        method: "POST",
        headers: {
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: form,
      };
      const res = await fetch(
        `${process.env.VITE_URL}/edit-images`,
        fetchOption
      );
      if (!res.ok) throw res.status;
      console.log(res.status);
      console.log("ok");
    } catch (err) {
      console.error(`Error with send edited image: ${err}`);
    }
  }
  async function compresImg(e) {
    try {
      setLoading(true);
      const imgType = e.target.name;
      const file = e.target.files[0];
      const compresedFile = await imageCompression(file, {
        maxSizeMB: 0.4,
        fileType: "image/jpeg",
      });
      const fromFileToBlob = new Blob([compresedFile], {
        type: compresImg.minetype,
      });
      console.log(fromFileToBlob)
      const reader = new FileReader();
      reader.readAsDataURL(fromFileToBlob);
      reader.onload = (e) => {
        const result = e.target.result;
        setNewImages((prev) => ({ ...prev, [imgType]: result }));
        setImagesAsBlob((prev) => [...prev, { [imgType]: compresedFile }]);
        setLoading(false);
      };
    } catch (err) {
      console.err(`Error with img compres: ${err}`);
    }
  }
  return (
    <div className="edit-profile-window">
      <label className="banner">
        <img src={newImages.banner} alt="banner" htmlFor="new-banner" />
        <input
          onChange={compresImg}
          type="file"
          name="banner"
          id="new-banner"
        />
      </label>
      <label className="avatar" htmlFor="new-avatar">
        <img src={newImages.avatar} alt="avatar" />
        <input
          onChange={compresImg}
          type="file"
          name="avatar"
          id="new-avatar"
        />
      </label>
      {loading && <p>Loading...</p>}
      <button className="confirm" onClick={sendEditedImage}>Confirm</button>
    </div>
  );
}
