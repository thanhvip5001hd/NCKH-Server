const express = require("express");
const useController = require("../controllers/userController");
const authController = require("../controllers/authController");

const userRouter = express.Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.get("/logout", authController.logout);
userRouter.post("/signUpWithGoogle", authController.signUpWithGoogle);
// Route ktra xem ng dùng đã đăng nhập chưa
// (dành cho Front end)

userRouter.get("/isLogin", authController.onAuthStateChanged);

userRouter.post("/forgotPassword", authController.forgotPassword);
userRouter.patch("/resetPassword/:token", authController.resetPassword);

userRouter.use(authController.protect);

userRouter.get("/getAllSetOfUser/:userId", useController.getAllSetOfUser);

userRouter.patch("/updateMyPassword", authController.updatePassword);

userRouter.get("/me", useController.getMe, useController.getUser);
userRouter.patch("/updateMe", useController.updateMe);
userRouter.delete("/deleteMe", useController.deleteMe);

userRouter.use(authController.restrictTo("admin"));

userRouter
  .route("/")
  .get(useController.getAllUsers)
  .post(useController.createUser);

userRouter
  .route("/:id")
  .get(useController.getUser)
  .patch(useController.updateUser)
  .delete(useController.deleteUser);

module.exports = { userRouter };
