import express from "express";

const router = express.Router();

function getUsersServiceUrl() {
  const serviceUrl = process.env.MONGODB_USERS_URL;
  if (!serviceUrl) {
    throw new Error("MONGODB_USERS_URL service binding is not configured.");
  }

  const baseUrl = serviceUrl.endsWith("/") ? serviceUrl : `${serviceUrl}/`;
  return new URL("users/", baseUrl);
}

async function forwardToUsersService(req, res, next) {
  try {
    const options = {
      method: req.method,
      headers: { accept: "application/json" },
    };

    if (req.method === "POST") {
      options.headers["content-type"] = "application/json";
      options.body = JSON.stringify(req.body ?? {});
    }

    const response = await fetch(getUsersServiceUrl(), options);
    const body = await response.text();
    const contentType = response.headers.get("content-type");

    res.status(response.status);
    if (contentType) {
      res.set("content-type", contentType);
    }
    res.send(body);
  } catch (error) {
    next(error);
  }
}

router.get("/", forwardToUsersService);
router.post("/", forwardToUsersService);

export default router;
