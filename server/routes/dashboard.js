const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

router.get("/", authorization, async(req, res) => {
    try {
        const user = await pool.query("SELECT * FROM USERS WHERE id = $1", [req.user])
        res.json(user.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

module.exports = router