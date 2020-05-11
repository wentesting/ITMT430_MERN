const passport = required("../config/passport");

function authorize(req, res, next) {
  const authorization = request.headers.authorization;
  if (!authorization)
    return res.status(401).json({ status: 401, message: "Invalid token" });
  const tokenArr = authorization.split(" ");
  if (tokenArr.length < 2)
    return res.status(401).json({ status: 401, message: "Invalid token" });
  passport(tokenArr[1], (err, res) => {
    if (err) return res.status(err.status || 400).json(err);
    if (!res)
      return res.status(401).json({ status: 401, message: "Invalid token" });
    request.authorizedUser = res;
    next();
  });
}

exports.authorize = authorize;
