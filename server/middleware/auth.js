
import jwt from "jsonwebtoken";
import ENV from '../config.js';

/** auth middleware */

export default async function (req, res, next){
    try {
        //access authorize header to validate request
       const token = req.headers.authorization.split(' ')[1];
        //retrieve the user details of the logged in user
        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET)
        req.user = decodedToken
       // res.json(decodedToken);
       next()  
        
    } catch (error) {
        return res.status(401).json({error: " Authentication Failed...!"})

    }
}
 




// import jwt from "jsonwebtoken";
// import ENV from '../config.js';

// /** auth middleware */

// export default async function (req, res, next) {
//     try {
//         // Access the authorization header to validate the request
//         const authorizationHeader = req.headers.authorization;

//         if (!authorizationHeader) {
//             return res.status(401).json({ error: "Authorization header is missing." });
//         }

//         // Split the header to get the token part
//         const token = authorizationHeader.split(' ')[1];

//         // Retrieve the user details of the logged-in user
//         const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

//         // Check token expiration
//         if (decodedToken.exp < Date.now() / 1000) {
//             return res.status(401).json({ error: "Token has expired. Please log in again." });
//         }

//         req.user = decodedToken;
//         // Proceed to the next middleware or route handler
//         next();

//     } catch (error) {
//         console.error("Authentication middleware error:", error);
//         return res.status(401).json({ error: "Authentication Failed." });
//     }
// }




export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession: false,
    }
    next()
}