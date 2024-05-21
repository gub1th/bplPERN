const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// get all teams
router.get("/", authorization, async(req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM teams")
        res.json(rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get one team
router.get("/:teamId", authorization, async(req, res) => {
    try {
        const { teamId } = req.params
        const { rows } = await pool.query("SELECT * FROM teams WHERE team_id = $1", [teamId])
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// add a team
router.post("/", authorization, async(req, res) => {
    try {
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user])
        const profileId = profile.rows[0].profile_id

        const { team_name, other_team_member } = req.body

        const { rows } = await pool.query(
            "INSERT INTO teams (name, member1_id, member2_id) VALUES ($1, $2, $3) RETURNING *",
            [team_name, profileId, other_team_member]
        )
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// delete a team
router.delete("/:teamId", authorization, async(req, res) => {
    try {
        const teamId = req.params.teamId
        const { rows } = await pool.query(
            "DELETE FROM teams WHERE team_id = $1 RETURNING *",
            [teamId]
        )
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// update a team (not done)
router.put("/:teamId", authorization, async(req, res) => {
    try {
        const teamId = req.params.teamId
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