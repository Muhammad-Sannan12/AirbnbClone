exports.error404 = (req, res, next) => {
  res.status(404).render("404", {
    PageTitle: "404 Page Not Found",
    currentPage: "404",
    isLoggedIn: req.cookies && req.cookies.isLoggedIn === "true",

    user: req.session.user,
  });
};
