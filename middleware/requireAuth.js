export default function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  // If not authenticated, redirect to the decoy page (oil prices)
  res.redirect('/oil');
}
