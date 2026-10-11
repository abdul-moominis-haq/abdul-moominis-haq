// Express middlewares can be exported from here
export const jsonErrorHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
};
