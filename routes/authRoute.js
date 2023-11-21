const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyOTP,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  createOrder,
  getOrders,
  updateOrderStatus,
  removeProductFromCart,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.get("/cart", authMiddleware, getUserCart);
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/cart", authMiddleware, userCart);
router.delete("/:id", deleteaUser);
router.put("/edit-user", authMiddleware, updateUser);



router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);
router.post("/otp", verifyOTP);

router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

router.put("/save-address", authMiddleware, saveAddress);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/delete-product-cart/:cartItemId", authMiddleware,removeProductFromCart);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/:id", authMiddleware, isAdmin, getaUser);

module.exports = router;
