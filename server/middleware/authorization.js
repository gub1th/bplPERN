const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = async(req, res, next) => {
    try {
        const jwtToken = req.header("token")
        console.log("authorization started")
        console.log(jwtToken)

        if (!jwtToken) {
            console.log("fucked if get here")
            return res.status(403).json("You are not authorized")
        }
    
        const payload = jwt.verify(jwtToken, process.env.JWTSECRET)
        req.user = payload.user
        next()

    } catch (err) {
        console.log(err.message)
        return res.status(403).json("You are not authorized")
    }
}