// const jwt = require('jsonwebtoken');

// const validatingAuthToken = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         if (!token) {
//             return res.status(401).send({ success: false, message: "No token provided" });
//         }
//         const decoded = jwt.verify(token, process.env.SecretKey);
//         req.body.userId = decoded.userId;
//         next();
//     } catch (error) {
//         res.status(401).send({ success: false, message: "Invalid Token" });
//     }
// };

// module.exports = validatingAuthToken;

const jwt = require('jsonwebtoken');

const validatingAuthToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({ success: false, message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send({ success: false, message: "No token provided" });
        }


        const decoded = jwt.verify(token, process.env.SecretKey);

        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        console.log("JWT ERROR:", error.message);

        return res.status(401).send({
            success: false,
            message: error.message   // <— very important for debugging
        });
    }
};

module.exports = validatingAuthToken;
