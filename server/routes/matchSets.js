const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// get all sets
router.get("/", authorization, async(req, res) => {
    try {
        const sets = await pool.query("SELECT * FROM match_sets")
        res.json(sets.rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get one set
router.get("/:matchSetId", authorization, async(req, res) => {
    try {
        const { matchSetId } = req.params
        const sets = await pool.query("SELECT * FROM match_sets WHERE set_id = $1", [matchSetId])
        res.json(sets.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

/////////////////////////TODO////////////////////////////
// MATCH AND SET LOWKEY SHOULD ONLY GRAB FOR PARTICULAR BRACKET

// add a match
// this needs work
router.post("/", authorization, async(req, res) => {
    try {
        const { name, start_date, end_date, active } = req.body
        const addMatch = await pool.query(
            "INSERT INTO matches (name, start_date, end_date, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, start_date, end_date, active]
        )
        res.json(addMatch.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// delete a match
router.delete("/:matchId", authorization, async(req, res) => {
    try {
        const matchId = req.params.matchId
        const deleteMatch = await pool.query(
            "DELETE FROM matches WHERE match_id = $1 RETURNING *",
            [matchId]
        )
        res.json(deleteMatch.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// update a match
// this needs work
router.put("/:matchId", authorization, async(req, res) => {
    try {
        const matchId = req.params.matchId
        const { name, start_date, end_date, active } = req.body
        const updateMatch = await pool.query(
            "UPDATE matches SET name = $1, start_date = $2, end_date = $3, is_active = $4 WHERE tournament_id = $5 RETURNING *",
            [name, start_date, end_date, active, matchId]
        )
        res.json(updateMatch.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

module.exports = router