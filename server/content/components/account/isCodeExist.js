function isCodeExist(req, res) {
  const cookies = req.cookies["two-auth"];
  if (!cookies) return res.status(404).json("Code doesn'y exist!");
  res.send("Ok");
}

export { isCodeExist };
