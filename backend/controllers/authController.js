import { promisify } from "util";
import {
  JWT_COOKIE_EXPRISE_IN,
  JWT_EXPIES_IN,
  JWT_SECRET,
} from "../config/config.js";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { CatchAsync } from "../utils/CatchAsync.js";
import jwt from "jsonwebtoken";
import { Email } from "../utils/email.js";

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPRISE_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // remove passwod from the output

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
};

export const signup = CatchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  const isExist = await User.findOne({ email });
  if (isExist) {
    return next(
      new AppError("this user already exsist please user an other email", 400),
    );
  }
  const newUser = await User.create({
    username,
    email,
    password,
    role,
    verificationCode,
    verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
  await new Email(newUser).sendVerificationCode();

  // createSendToken(newUser, 201, res);
  res.status(201).json({ newUser });
});

export const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1)check if email and password exist
  if (!email || !password) {
    return next(new AppError("please provide an email and password", 400));
  }
  // 2) check if user exists and password is correct

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  // 3) if everthing ok and token to client
  createSendToken(user, 200, res);
});
export const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

export const getLoginUser = async (req, res, next) => {
  res.status(200).json(req.user);
};

export const verifyEmail = CatchAsync(async (req, res, next) => {
  const { code } = req.body;

  const user = await User.findOne({
    verificationCode: code,
    verificationTokenExpiresAt: { $gt: Date.now() },
  });

  if (!user)
    return next(new AppError("Invalid or expired verification code", 400));

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationTokenExpiresAt = undefined;
  await user.save();
  const DashboadURL = "/home";

  await new Email(user, DashboadURL).sendWelcome();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    user: {
      ...user._doc,
      password: undefined,
    },
  });
});

export const protect = CatchAsync(async (req, res, next) => {
  // 1) Getting token and checking if its exists

  let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  // else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }
  token = req.cookies.jwt;

  if (!token) {
    return next(
      new AppError("you are not logged in! please  to get access ", 401),
    );
  }

  // 2) verication token
  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  // 3) check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token no longer exists", 401),
    );
  }

  // 4) check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed password! please login again", 401),
    );
  }

  //GRANT ACCESS TO PROTECT ROUTES
  req.user = currentUser;

  next();
});
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'chef']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};

// export const forgotPassword = CatchAsync(async (req, res, next) => {
//   // 1) Get user based on POSTed email
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!email) {
//     return next(new AppError("please provide your email"));
//   }
//   if (!user) {
//     return next(new AppError("There is no user with email address.", 404));
//   }

//   // 2) Generate the random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send it to user's email

//   // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

//   try {
//     const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

//     await new Email(user, resetURL).sendResetPassword();

//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email!",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     console.log("error", err);
//     return next(
//       new AppError("There was an error sending the email. Try again later!"),
//       500
//     );
//   }
// });

// export const resetPassword = CatchAsync(async (req, res, next) => {
//   // 1) Get user based on the token
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(new AppError("Token is invalid or has expired", 400));
//   }
//   user.password = req.body.password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 3) Update changedPasswordAt property for the user
//   // 4) Log the user in, send JWT
//   createSendToken(user, 200, res);
// });

export const updatePassword = CatchAsync(async (req, res, next) => {
  // 1️⃣ Get user ID (login OR params)
  const userId = req.user?.id || req.params.id;

  if (!userId) {
    return next(new AppError("User ID is required", 400));
  }

  // 2️⃣ Get user from DB (include password)
  const user = await User.findById(userId).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // 3️⃣ Check currentPassword
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new AppError("Current password and new password are required", 400),
    );
  }

  // 4️⃣ Check if user has password (OAuth users)
  if (!user.password) {
    return next(new AppError("This account does not have a password", 400));
  }

  // 5️⃣ Compare current password
  const isMatch = await user.comparePassword(currentPassword, user.password);

  if (!isMatch) {
    return next(new AppError("Your current password is incorrect", 400));
  }

  // 6️⃣ Update password
  user.password = newPassword;
  await user.save(); // pre('save') will hash

  // 7️⃣ If logged in → send new token
  if (req.user) {
    return createSendToken(user, 200, res);
  }

  // 8️⃣ If NOT logged in → simple response
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});
