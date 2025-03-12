import jwt from "jsonwebtoken";

// Temporary storage for blacklisted tokens (Use Redis or DB in production)
const blacklistedTokens = new Set();

// Middleware: Verify JWT token (Check if user is logged in)
export const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided, please log in." });
        }

        if (blacklistedTokens.has(token)) {
            return res.status(401).json({ message: "Session expired, please log in again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        // console.log("Decoded Token:", decoded);  // token payload

        req.auth = decoded; // Attach user data to request

        next();
    } catch (error) {
        // console.log("JWT Error:", error.message); // Log any JWT errors
        return res.status(401).json({ message: "Invalid token, please log in again." });
    }
};


// Middleware: Protect logout sessions (Blacklist tokens)
export const isTokenBlacklisted = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; //Extract jwt token here

    //if token == 0 then
    if (!token) {
        return res.status(401).send("Access Denied! Please log in.");
    }
// If request here an expired token let user to sign in
    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ message: "Session expired, please log in again." });
    }

    next();
};


// Middleware: Role-based access control
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.auth || !allowedRoles.includes(req.auth.role)) {
            return res.status(403).json({ message: "Access denied! Unauthorized role." });
        }
        next();
    };
};
