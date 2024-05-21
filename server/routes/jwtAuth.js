const router = require("express").Router();
const pool = require("../db")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator")
const validInfo = require("../middleware/validInfo")
const authorization = require("../middleware/authorization")

router.post("/register", validInfo, async (req, res) => {
    try {
        // destructure req.body
        const { first_name, last_name, nickname, email, password} = req.body

        // check if the user exists (if exists then throw error)
        const user = await pool.query("SELECT * from users WHERE email = $1", [email])
        
        if (user.rows.length !== 0) {
            return res.status(401).json("Email already exists");
        }

        // bcrypt the user password
        const saltRound = 10
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        // enter the new user inside our database
        const newUser = await pool.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, bcryptPassword])

        // create a profile for the new user
        const profile = await pool.query("INSERT INTO profiles (user_id, first_name, last_name, nickname) VALUES ($1, $2, $3, $4) RETURNING *",
            [newUser.rows[0].user_id, first_name, last_name, nickname])

        //generate our jwt token
        const token = jwtGenerator(newUser.rows[0].user_id)

        return res.json({token})

    } catch (err) {
        res.status(500).send("Server error")
    }
})

// login route
router.post("/login", validInfo, async (req, res) => {
    try {
        // destructure the req.body
        const { email, password } = req.body

        // check if user doesnt exist (if not we throw error)
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        
        if (user.rows.length == 0) {
            return res.status(401).json("Password or email is incorrect")
        }

        // check if incoming password is the same as database password
        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        if (!validPassword) {
            return res.status(401).json("Password or email is incorrect")
        }

        // give them the jwt token
        const token = jwtGenerator(user.rows[0].user_id)
        console.log("we giving this")
        console.log(token)
        return res.json({token})

    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

router.get("/is-verify", authorization, async(req, res) => {
    try {
        res.json(true)
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server error")
    }
})

module.exports = router;