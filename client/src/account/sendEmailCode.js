    async function sendEmailCode(code, setCodeStatus) {
    try {
        const fetchOptions = {
        method: "POST",
        headers: {
            "Content-type": "applicaiton/json",
            token: sessionStorage.getItem("session"),
        },
        credentials: "include",
        body: JSON.stringify({ code }),
        };
        const res = await fetch(`${process.env.VITE_URL}/send-code`, fetchOptions);
        if (!res.ok) {
        const obj = await res.json();
        throw `${obj}: ${res.status}`;
        }
        console.log("ok");
    } catch (err) {
        console.error(err);
    }
    }
    export { sendEmailCode };
