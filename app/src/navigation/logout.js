export async function logout(refreshUser, navigate) {
  try {
    const res = await fetch(`${import.meta.env.VITE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw Error(`Error with logout btn: ${res.status}`);
    const msg = await res.json();
    refreshUser();
    navigate("/");
  } catch (err) {
    throw Error(`Error with logout fn: ${err}`);
  }
}
