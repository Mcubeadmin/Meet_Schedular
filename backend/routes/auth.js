// auth.js (ES Module Standard)

import express from "express";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
// Note: Ensure your models/middleware/services files are also using 'export'
import User from "../models/User.js"; 
// import { sendVerificationEmail } from "../services/emailservice.js";
// import publish from "../kafka/producer.js"

const router = express.Router();

console.log("AUTH ROUTER LOADED")

// router.get("/me", authMiddleware, (req, res) => {
//     res.json({ msg: "Protected route accessed", user: req.user});
// });

// REGISTER USER
router.post("/register", async (req, res) => {
    console.log("REGISTER HIT")
    try {
        const { name, email, password } = req.body;
        console.log(req.body);

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields required!"});
        }

        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: "User already exists!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = jwt.sign(
            { name, email, hashedPassword: hashedPassword },
            process.env.JWT_SECRET,
            { expiresIn: "15m"}
        );

        // Email Verification disabled
        // await sendVerificationEmail(email, verificationToken);        
        
        // remove this when email verification enabled
        await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        // return res.json({ msg: "Please Verify email to activate account!" });
        return res.json({ msg: "Email Verified" });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({msg: "Server Error"});
    }
});

// VERIFY EMAIL
router.get("/verify", async (req, res) => {
    const { token } = req.query;
    console.log("Verify hit")
    try {
        if (!token) {
             return res.status(400).send("Invalid token: Missing");
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ email: decoded.email });
        
        if (user) {
            console.log("User already verified")
            return res.status(400).json({ error: "Verification link expired" });

        }
        
        await User.create({
            name: decoded.name,
            email: decoded.email,
            password: decoded.hashedPassword
        });

        // await publish("user.registered", {
        //     name: decoded.name,
        //     email: decoded.email
        // });

        console.log(`User ${decoded.name} added!`);
        return res.status(200).json({ message: "Verification successful." });
        
    } catch (err) {
        console.error("VERIFY ERROR:", err.message);
        return res.status(400).send("Verification link expired or invalid!");
    }
});


// LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if ( !email || !password ) {
            return res.status(400).json({msg: "All fields required"});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({msg: "Invalid email or password"});
        }
        
        // Optional: Check if the user is verified before allowing login
        // if (!user.isVerified) {
        //     return res.status(401).json({msg: "Please verify your email first."});
        // }

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({msg: "Invalid email or password"});
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE}
        );
        // await publish("user.loggedin", {
        //     id: user._id,
        //     timestamp: Date.now()
        // })
        res.json({ msg: "Login Successful", token });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({msg: "Server error"});
    }
});

export default router;