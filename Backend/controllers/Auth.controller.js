import { handleError } from "../helpers/handleError.js"
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(handleError(409, "User already registered"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    await User.create({ name, email, password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Registration successful"
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};



export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(401, "Invalid login credentials"));
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return next(handleError(401, "Invalid login credentials"));
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      user: safeUser,
      message: "Login successful"
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};


export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
        password: bcryptjs.hashSync(Math.random().toString(), 10),
        role: "user"
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      user: safeUser,
      message: "Login successful"
    });
  } catch (err) {
    next(handleError(500, err.message));
  }
};


export const Logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });
        res.status(200).json({
            success: true,
            message: 'Logout successful.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}
