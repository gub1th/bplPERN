const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")


// this is the same one as in ranking.js, should refactor later
router.get("/", authorization, async(req, res) => {
    try {
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user])
        console.log(profile.rows[0].profile_id)
        res.json(profile.rows[0])
    } catch (err) {
        console.log("yes")
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

module.exports = router