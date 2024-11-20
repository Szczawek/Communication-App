import {createNewAccount} from "./createNewAccount"

async function isCodeCorrect(code) {
  const options = {
    method: "POST",
    headers: {
      "Content-type":"application/json",
      token: sessionStorage.getItem("session"),
    },
    credentials: "include",
    body:JSON.stringify({code})
  };
  const res = await fetch(`${process.env.VITE_URL}/check-email-code`, options);
  if (!res.ok) throw res.status;
  const obj = await res.json();
  await createNewAccount()
  console.log(obj);
}
export { isCodeCorrect };
