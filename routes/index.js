const router = require("express").Router();
const { register, login } = require("../controllers/users");
const articleRouter = require("./articles");
const userRouter = require("./users");
// auth middleware
const checkAuthorization = require("../middlewares/auth");
// joi validation middleware
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/not-found-err");

// Two public routes that don't need auth middleware.
router.post("/signup", validateUserBody, register);
router.post("/signin", validateAuthentication, login);

router.use("/articles", checkAuthorization, articleRouter);
router.use("/users", checkAuthorization, userRouter);

// Middleware to handle non-existent routes.
router.use((req, res, next) => {
  next(new NotFoundError("The requested resource not found"));
});

module.exports = router;
