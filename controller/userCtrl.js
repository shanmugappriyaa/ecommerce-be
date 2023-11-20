const error = require("mongoose/lib/error");
const userModel = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refershToken");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");
const {
  transporter,
  mailOptions,
  randomStringGenerate,
} = require("../common/nodeMail");
const dotenv = require("dotenv");
dotenv.config();

const createUser = async (req, res) => {
  const email = req.body.email;
  const findUser = await userModel.findOne({ email: email });
  if (!findUser) {
    const newUser = await userModel.create(req.body);
    console.log(req.body);
    res.status(200).send({
      message: "User  Registered Succesfully",
      newUser,
    });
  } else {
    res.status(500).send({
      message: `User Already Exists ${email}`,
      error: error.message,
    });
  }
};

// Login a user
const loginUserCtrl = async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await userModel.findOne({ email });
  if (findUser && (await findUser.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await userModel.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).send({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    res.status(500).send({
      msg: "Invalid User Data",
      error: error.msg,
    });
  }
};
//AdminLogin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await userModel.findOne({ email });
  if (findAdmin.role !== "admin") {
    res.status(500).send({
      msg: "Not Authorized person",
    });
  }
  if (findAdmin && (await findAdmin.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).send({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    res.status(500).send({
      msg: "Invalid credentials",
      error: error.msg,
    });
  }
};

//add to wishlist
const getWishlist = async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await userModel.findById(_id).populate("wishlist");
    res.status(200).send({
      msg: "",
      findUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//save userAddress
const saveAddress = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      msg: "address updated Successfully",
      updateUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//handle refresh Token
const handleRefreshToken = async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await userModel.findOne({ refreshToken });
  // res.json(user);
  if (!user) throw new Error(" No refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error(" There is something wrong in refersh token");
    }
    const accessToken = generateToken(user?._id);
    res.status(200).send({ accessToken });
  });
};
//get all users
const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find().populate("wishlist");
    res.status(200).send({
      message: "User Data Fetched Succesffully",
      users,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//Get a Singleuser
const getaUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findUser = await userModel.findById(id);
    res.status(200).send({
      message: "User Data Fetched Succesffully",
      findUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// delete a user
const deleteaUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findUser = await userModel.findByIdAndDelete(id);
    res.status(200).send({
      message: "User Data Deleted Succesffully",
      findUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//updata a user

const updateUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateuser = await userModel.findByIdAndUpdate(
      _id,
      {
        firstname: req.body?.firstname,
        lastname: req.body?.lastname,
        email: req.body?.email,
        mobile: req.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      message: "User Data Updated Succesffully",
      updateuser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//logout user
const logout = async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(204).send({ msg: "Logged out successfully" });
  }
  await userModel.findByIdAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(200).send({ msg: "Logged out successfully" });
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const randomString = randomStringGenerate();
      const path = process.env.FRONT_END_URL + "/otp/" + user._id;
      mailOptions.to = user.email;
      mailOptions.html = `Hi ${user.userName} Please find the OTP ${randomString} in the following link to reset your password
      <a href=${path}> Reset password link`;
      const updatedUser = await userModel.updateOne(
        { email: req.body.email },
        { $set: { OTP: randomString } },
        { new: true }
      );
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: " + error);
          res.status(500).send({
            message: "Failed to send email.",
            errorMsg: error.message,
          });
        } else {
          console.log("Email sent: " + info.response);
          res.status(201).send({
            message: "Email Sent Successfully.",
          });
        }
      });
    } else {
      res.status(400).send({
        message: `Account with ${req.body.email} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const verifyOTP = async (req, res) => {
  console.log("restPage OTP--", req.body);
  try {
    let user = await userModel.findOne({ _id: req.body.id });
    if (user) {
      if (user.OTP === req.body.OTP) {
        res.status(200).send({
          message: "OTP verified.",
        });
      } else {
        res.status(400).send({
          message: "Pls check your OTPand try again",
        });
      }
    } else {
      res.status(400).send({
        message: "user does not exist",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.body.id });
    if (user) {
      req.body.password = await auth.hashPassword(req.body.password);
      user.password = req.body.password;
      await user.save();
      res.status(200).send({
        message: "Password updated Succesfully",
      });
    } else {
      res.status(400).send({
        message: `Account with ${req.body.email} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
//add to cart
const userCart = async (req, res) => {
  const { productId, quantity, price } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      price,
      quantity,
    }).save();
    res.status(200).send({
      message: "",
      newCart,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUserCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id }).populate("productId");
    res.status(200).send({
      msg: "",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const emptyCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await userModel.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.status(200).send({
      msg: "",
      cart,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const createOrder = async (req, res) => {
  const { _id } = req.user;
  const { COD } = req.body;
  validateMongoDbId(_id);
  try {
    if (!COD) {
      res.status(400).send({
        msg: "Create Cash oN order failed",
      });
    }
    const user = await userModel.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmount = 0;
    if (userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash On Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash On Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.status(200).send({
      message: "order Successful",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userOrders = await Orders.findOne({ orderby: _id })
      .populate("products.product")
      .exec();
    res.status(200).send({
      message: "",
      userOrders,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.status(200).send({
      updateOrderStatus,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateUser,
  handleRefreshToken,
  logout,
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
  updateOrderStatus,
  getOrders,
};
