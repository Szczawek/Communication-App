async function sendConfirmCode(email) {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      token: sessionStorage.getItem("session"),
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  };
  const res = await fetch(`${process.env.VITE_URL}/send-email-code`, options);
  if (!res.ok) throw res.status;
  const obj = await res.json();
  console.log(obj);
}
export { sendConfirmCode };
