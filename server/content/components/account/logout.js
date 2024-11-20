async function logout(req, res) {
  await new Promise((resolve) => {
    res.clearCookie("user_id", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    resolve();
  });
  res.json("Logout");
}
export { logout };
