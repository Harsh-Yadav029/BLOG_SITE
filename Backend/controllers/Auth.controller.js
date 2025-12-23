import { handleError } from "../helpers/handleError.js"
import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const Register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const checkuser = await User.findOne({ email })
        if (checkuser) {
            // user already registered 
            next(handleError(409, 'User already registered.'))
        }

        const hashedPassword = bcryptjs.hashSync(password)
        // register user  
        const user = new User({
            name, email, password: hashedPassword
        })

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Registration successful.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}


export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            next(handleError(404, 'Invalid login credentials.'))
        }
        const hashedPassword = user.password

        const comparePassword = bcryptjs.compare(password, hashedPassword)
        if (!comparePassword) {
            next(handleError(404, 'Invalid login credentials.'))
        }

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
        }, process.env.JWT_SECRET)


        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        const newUser = user.toObject({ getters: true })
        delete newUser.password
        res.status(200).json({
            success: true,
            user: newUser,
            message: 'Login successful.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const GoogleLogin = async (req, res, next) => {
    try {
        const { name, email, avatar } = req.body

        let user = await User.findOne({ email })

        if (!user) {
            const password = Math.random().toString()
            const hashedPassword = bcryptjs.hashSync(password)

            user = await User.create({
                name,
                email,
                avatar,
                password: hashedPassword,
                role: 'user' // default role
            })
        }

        // 🔥 FIX 1: INCLUDE ROLE IN JWT
        const token = jwt.sign(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role // 🔥 REQUIRED
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        // 🔥 FIX 2: COOKIE SETTINGS FOR LOCALHOST
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,   // localhost
            sameSite: 'lax', // 🔥 IMPORTANT
            path: '/'
        })

        const safeUser = user.toObject()
        delete safeUser.password

        res.status(200).json({
            success: true,
            user: safeUser,
            message: 'Login successful.'
        })
    } catch (error) {
        next(error)
    }
}


export const Logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token", {
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
