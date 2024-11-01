async function areDataUnqiue(data, emailWarning, unqiueNameWarning) {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      token: sessionStorage.getItem("session"),
    },
    credentials: "include",
    body: JSON.stringify(data),
  };
  const res = await fetch(`${process.env.VITE_URL}/is-data-valid`, options);
  const obj = await res.json();
  if (!res.ok) {
    if (res.status == 403) {
      const { unqiueName, email } = obj;
      console.log(unqiueName,email)
      if (unqiueName) unqiueNameWarning();
      if (email) emailWarning();
    }
    throw res.status;
  }
}

export { areDataUnqiue };
