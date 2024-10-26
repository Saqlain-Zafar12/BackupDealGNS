const roleMiddleware = (allowedRoles) => (req, res, next) => {
    console.log(req.user.role,"allowedRoles");
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = roleMiddleware;
