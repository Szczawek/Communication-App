async function createNewAccount() {
  const fetchOptions = {
    method: "POST",
    headers: {
      token: sessionStorage.getItem("session"),
    },
    credentials: "include",
  };

  const res = await fetch(
    `${process.env.VITE_URL}/create-account`,
    fetchOptions
  );
  if (!res.ok) {
    throw "I don't know";
    // if (res.status == 400) {
    //   // return setWarnings((prev) => ({ ...prev, emailWarning: true }));
    // }
    // const obj = await res.json();
    // throw `${obj}: ${res.status}`;
  }
  console.log("ok");
}

export { createNewAccount };
