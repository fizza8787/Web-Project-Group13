const isClient = (req, res, next) => {
  if (req.user.role !== 'client')
    return res.status(403).json({ success: false, message: 'Clients only' });
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admins only' });
  next();
};

const isFreelancer = (req, res, next) => {
  if (req.user.role !== 'freelancer')
    return res.status(403).json({ success: false, message: 'Freelancers only' });
  next();
};

module.exports = { isClient, isAdmin, isFreelancer };