const renderError = (req, res, err) => {
  res.status(500).render('layout/index', {
    body: '../pages/error.ejs',
    error: err.message
  });
};

module.exports = {
  renderError
};
