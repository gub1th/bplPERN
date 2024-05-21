const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// get all matches
router.get("/", authorization, async(req, res) => {
    try {
        const matches = await pool.query("SELECT * FROM matches")
        res.json(matches.rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get one match
router.get("/:matchId", authorization, async(req, res) => {
    try {
        const { matchId } = req.params
        const matches = await pool.query("SELECT * FROM matches WHERE match_id = $1", [matchId])
        res.json(matches.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

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

// update a match (and its matchSets IG)
// this needs work
router.patch("/:matchId", authorization, async(req, res) => {
    try {
        const matchId = req.params.matchId
        const { date, location, homeTeamId, winnerId, sets } = req.body
        console.log(date, location, homeTeamId, winnerId, sets)

        // get current match
        var currMatch = await pool.query(
            "SELECT * FROM matches WHERE match_id = $1",
            [matchId]
        )
        currMatch = currMatch.rows[0]
        console.log(currMatch)

        // general updates for match
        const updateMatch = await pool.query(
            "UPDATE matches SET match_date = $1, location = $2, home_team_id = $3, winner_id = $4 WHERE match_id = $5 RETURNING *",
            [date, location, homeTeamId, winnerId, matchId]
        )
        console.log(updateMatch.rows[0])

        // get the current matchsets
        var matchSets = await pool.query(
            "SELECT * FROM match_sets WHERE match_id = $1",
            [matchId]
        )
        matchSets = matchSets.rows

        // delete if there are less sets than current (this prob wont happen often)
        if (sets.length < matchSets.length) {
            for (i=matchSets.length; i > sets.length; i--) {
                var currMatchSetIndex = matchSets[i].set_number
                await pool.query(
                    "DELETE FROM match_sets WHERE match_id = $1 AND set_number = $2",
                    [matchId, currMatchSetIndex]
                )

            }
        }
        
        // there are more or equal sets than are currently in the db
        for (i=0; i<sets.length; i++) {
            currSet = sets[i]
            const winningTeamId = sets[i].score_team1 > sets[i].score_team2 ? currMatch.team1_id : currMatch.team2_id
            console.log(winningTeamId)
            console.log("winning team iddd\n\n\n\n\n")
            if (i > matchSets.length-1) {
                // create a new one
                await pool.query(
                    `
                    INSERT INTO match_sets(match_id, set_number, score_team1, score_team2, winning_team_id)
                    VALUES($1, $2, $3, $4, $5)
                    RETURNING *
                    `,
                    [matchId, i+1, currSet.score_team1, currSet.score_team2, winningTeamId]
                )
            } else {
                // update the existing one
                await pool.query(
                    "UPDATE match_sets SET score_team1=$1, score_team2=$2, winning_team_id=$3 WHERE match_id=$4 AND set_number=$5",
                    [currSet.score_team1, currSet.score_team2, winningTeamId, matchId, i+1]
                )
            }
        
        }

        // send a success message as a string
        res.json("success")
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get the matchsets of a particular match
router.get("/:matchId/matchSets", authorization, async(req, res) => {
    try {
        console.log("poopoo\n\n\n")
        const matchId = req.params.matchId
        console.log(matchId)
        const matchSets = await pool.query(
            "SELECT * FROM match_sets WHERE match_id = $1",
            [matchId]
        )
        res.json(matchSets.rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get the teams of a particular match
router.get("/:matchId/teams", authorization, async(req, res) => {
    try {
        console.log("get match teams\n\n\n")
        const { matchId } = req.params
        const matchObj = await pool.query("SELECT * FROM matches WHERE match_id = $1", [matchId])
        const match = matchObj.rows[0]

        const homeTeamObj = await pool.query("SELECT * FROM teams WHERE team_id = $1", [match.team1_id])
        const awayTeamObj = await pool.query("SELECT * FROM teams WHERE team_id = $1", [match.team2_id])
        const teams = [homeTeamObj.rows[0], awayTeamObj.rows[0]]
        res.json(teams)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

module.exports = router