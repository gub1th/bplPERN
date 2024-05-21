const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// get all profiles
router.get("/", authorization, async(req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM profiles")
        res.json(rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get one profile
router.get("/:profileId", authorization, async(req, res) => {
    try {
        const { profileId } = req.params
        const { rows } = await pool.query("SELECT * FROM profiles WHERE profile_id = $1", [profileId])
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// delete a profile
router.delete("/:profileId", authorization, async(req, res) => {
    try {
        const profileId = req.params.profileId
        const { rows } = await pool.query(
            "DELETE FROM profiles WHERE profile_id = $1 RETURNING *",
            [profileId]
        )
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// update a profile
router.put("/:profileId", authorization, async(req, res) => {
    try {
        const profileId = req.params.profileId
        const { first_name, last_name, image_url, nickname } = req.body
        const { rows } = await pool.query(
            "UPDATE profiles SET first_name = $1, last_name = $2, image_url = $3, nickname = $4 WHERE profile_id = $5 RETURNING *",
            [first_name, last_name, image_url, nickname, profileId]
        )
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

module.exports = router