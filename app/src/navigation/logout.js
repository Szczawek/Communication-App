export async function logout(searchLoggedInUser) {
  try {
    const res = await fetch(`${import.meta.env.VITE_URL}/logout`, {
      method: "POST",
      headers: {
        token: localStorage.getItem("session"),
      },
      credentials: "include",
    });
    if (!res.ok) throw Error(`Error with logout btn: ${res.status}`);
    const msg = await res.json();
    console.log(msg);
    await searchLoggedInUser();
  } catch (err) {
    throw Error(`Error with logout fn: ${err}`);
  }
}
