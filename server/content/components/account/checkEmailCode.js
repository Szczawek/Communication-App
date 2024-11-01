async function checkEmailCode(req, res) {
  try {
    const correctCode = res.cookies["two-auth"];
    console.log(correctCode)
    const { code } = req.body;
    if (correctCode == code) {
      return res.json("ok");
    }
    res.status(403).json("incorrect code!");
  } catch (err) {
    console.log(err);
    res.status(405).json(err);
  }
}
export {checkEmailCode}