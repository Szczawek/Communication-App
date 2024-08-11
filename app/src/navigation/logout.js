export async function logout(searchLoggedInUser) {
  try {
    const res = await fetch(`${process.env.VITE_URL}/api/logout`, {
      method: "POST",
      headers: {
        token: sessionStorage.getItem("session"),
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
