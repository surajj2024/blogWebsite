// controller/user.controller.js
import User from "../model/user.model.js";
import customError from "../utils/error.js";

export const registerUser = async (req, res, next) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => !field.trim())) {
    return next(new customError("All fields are required", 400));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new customError("User already exists", 409));
    }

    const newUser = new User({ email, username, password });
    await newUser.save();

    const createdUser = await User.findOne({ _id: newUser._id }).select(
      "-password -refreshToken"
    );

    res
      .status(201)
      .json({ createdUser, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!(email || username)) {
    return next(new customError("Email or username is required", 400));
  }

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return next(new customError("User not found", 404));
    }

    if (!(await user.isPasswordCorrect(password))) {
      return next(new customError("Invalid email or password", 401));
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const cookieOptions = {
      secure: false,
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        user: loggedInUser,
        message: "User logged in successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  const id = req.user._id;

  try {
    await User.findByIdAndUpdate(
      id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
    const cookieOption = {
      secure: false,
      httpOnly: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookieOption)
      .clearCookie("refreshToken", cookieOption)
      .json({ message: "user logged out" });
  } catch (error) {
    next(new customError("something went wrong" || error.message, 500));
  }
};

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error while generating tokens:", error);
    throw new customError("Error while generating tokens", 500);
  }
};
