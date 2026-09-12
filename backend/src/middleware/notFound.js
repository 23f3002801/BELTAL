const notFound = (req, res) => {
  res.status(404).json({ error: { message: `Not found: ${req.method} ${req.originalUrl}`, status: 404 } });
};

export default notFound;
