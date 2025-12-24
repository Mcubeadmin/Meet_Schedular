import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authorizer(req, res, next) {
    const authHeader = req.headers.authorization;

    if ( !authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (err) {
        console.error("AUTH ERROR:", err);
        res.status(401).json({ msg: "Token invalid or expired" });
    }
};

