const jwt = require("jsonwebtoken")
require("dotenv").config();

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    }
    console.log("boom")
    console.log(payload)
    return jwt.sign(payload, process.env.JWTSECRET, {expiresIn: "1hr"})
}

module.exports = jwtGenerator;