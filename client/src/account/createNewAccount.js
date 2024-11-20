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
  if (!res.ok) throw res.status
  console.log("ok");
} 

export { createNewAccount };
