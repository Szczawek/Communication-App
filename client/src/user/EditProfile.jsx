import { useContext, useState } from "react";
import { UserFunctions } from "../App";
import imageCompression from "browser-image-compression";

export default function EditProfile() {
  const { editProfileImages, loggedInUser } = useContext(UserFunctions);
  const { avatar, banner, id } = loggedInUser;

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
        console.log(type);
        form.append(type, obj[type]);
      }

      form.append("ownerID", id);
      const fetchOptions = {
        method: "POST",
        headers: {
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: form,
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/edit-images`,
        fetchOptions
      );
      if (!res.ok) throw res.status;
      await loadUploadedImages();
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
      const alllowed = ["jpeg", "png", "jpg", ".svg"];

      if (!alllowed.includes(file.type.slice(6))) return setLoading(false);
      const compresedFile = await imageCompression(file, {
        maxSizeMB: 0.4,
        fileType: "image/jpeg",
      });
      const fromFileToBlob = new Blob([compresedFile], {
        type: "image/jpeg",
      });

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

  async function loadUploadedImages() {
    try {
      const fetchOptions = {
        header: {
          token: sessionStorage.getItem("session"),
        },
        credentials: "include",
      };
      const res = await fetch(
        `${process.env.VITE_URL}/api/uploded-images`,
        fetchOptions
      );
      if (!res.ok) throw res.status;
      const { avatar, banner } = await res.json()[0];
      editProfileImages(avatar, banner);
    } catch (err) {
      console.error(`Error with server: ${err}`);
    }
  }
  return (
    <div className="edit-profile-window">
      <label className="banner">
        <img src={newImages.banner} alt="banner" htmlFor="new-banner" />
        <input
          accept=".png,.svg ,.jpg"
          onChange={compresImg}
          type="file"
          name="banner"
          id="new-banner"
        />
      </label>
      <label className="avatar" htmlFor="new-avatar">
        <img src={newImages.avatar} alt="avatar" />
        <input
          accept=".png,.svg ,.jpg"
          onChange={compresImg}
          type="file"
          name="avatar"
          id="new-avatar"
        />
      </label>
      {loading && <p>Loading...</p>}
      <button className="confirm" onClick={sendEditedImage}>
        Confirm
      </button>
    </div>
  );
}
