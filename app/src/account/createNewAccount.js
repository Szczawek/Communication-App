async function createNewAccount(accountData, setWarnings) {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      token: sessionStorage.getItem("session"),
    },
    credentials: "include",
    body: JSON.stringify(accountData),
  };
  try {
    const res = await fetch(
      `${process.env.VITE_URL}/create-account`,
      fetchOptions
    );
    if (!res.ok) {
      if (res.status == 400) {
        return setWarnings((prev) => ({ ...prev, emailWarning: true }));
      }
      const obj = await res.json();
      throw `${obj}: ${res.status}`;
    }
  } catch (err) {
    throw err;
  }
}

export { createNewAccount };
