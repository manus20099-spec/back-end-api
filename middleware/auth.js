import jwt from "jsonwebtoken";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    const error = new Error("Authentication is not configured. Set JWT_SECRET.");
    error.status = 503;
    throw error;
  }
  return process.env.JWT_SECRET;
}

export function createAccessToken(userId) {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: "HS256",
    subject: userId,
    expiresIn: "1h",
  });
}

export function requireAuth(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      data: null,
      error: true,
      errorMsg: "A valid bearer token is required",
    });
  }

  let payload;
  try {
    payload = jwt.verify(authorization.slice(7), getJwtSecret(), {
      algorithms: ["HS256"],
    });
  } catch (error) {
    if (error.status === 503) return next(error);
    return res.status(401).json({
      data: null,
      error: true,
      errorMsg: "Invalid or expired token",
    });
  }

  if (typeof payload === "string" || typeof payload.sub !== "string") {
    return res.status(401).json({
      data: null,
      error: true,
      errorMsg: "Invalid or expired token",
    });
  }

  req.userId = payload.sub;
  next();
}
