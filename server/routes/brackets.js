const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// get all brackets
router.get("/", authorization, async(req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM brackets")
        res.json(rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get one bracket
router.get("/:bracketId", authorization, async(req, res) => {
    try {
        const { bracketId } = req.params
        const { rows } = await pool.query("SELECT * FROM brackets WHERE bracket_id = $1", [bracketId])
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// add a bracket
router.post("/", authorization, async(req, res) => {
    try {
        const { tournament_id } = req.body
        console.log("poo")
        console.log(tournament_id)
        const { rows } = await pool.query(
            "INSERT INTO brackets (tournament_id) VALUES ($1) RETURNING *",
            [tournament_id]
        )

        console.log("pooo popo")
        console.log(rows[0])
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// delete a bracket
router.delete("/:bracketId", authorization, async(req, res) => {
    try {
        const bracketId = req.params.bracketId
        const { rows } = await pool.query(
            "DELETE FROM brackets WHERE bracket_id = $1 RETURNING *",
            [bracketId]
        )
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// update a bracket
router.put("/:bracketId", authorization, async(req, res) => {
    try {
        const bracketId = req.params.bracketId
        const { name, bracket_type, start_date, end_date, active } = req.body
        const { rows } = await pool.query(
            "UPDATE brackets SET name = $1, bracket_type = $2, start_date = $3, end_date = $4, is_active = $5 WHERE bracket_id = $6 RETURNING *",
            [name, bracket_type, start_date, end_date, active, bracketId]
        )
        res.json(rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get teams of a particular bracket
router.get('/:bracketId/teams', async (req, res) => {
    try {
        const bracketId = req.params.bracketId;
        const query = `
            SELECT *
            FROM bracket_teams JOIN teams ON bracket_teams.team_id = teams.team_id
            WHERE bracket_id = $1
        `;
        const values = [bracketId];
        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching team count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get tournamnet of a particular bracket
router.get('/:bracketId/tournament', async (req, res) => {
    try {
        const bracketId = req.params.bracketId;
        // get the bracket
        const { rows } = await pool.query("SELECT * FROM brackets WHERE bracket_id = $1", [bracketId])
        // get the tournament
        const tournamentId = rows[0].tournament_id
        const { rows: rows2 } = await pool.query("SELECT * FROM tournaments WHERE tournament_id = $1", [tournamentId])
        res.json(rows2[0])
    } catch (error) {
        console.error('Error fetching tournament of particular bracket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get brackets of a particular tournament
router.get('/:tournamentId/brackets', async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const query = `
            SELECT *
            FROM brackets
            WHERE tournament_id = $1
        `;
        const values = [tournamentId];
        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching brackets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get matches of a particular bracket
router.get('/:bracketId/matches', async (req, res) => {
    try {
        const bracketId = req.params.bracketId;
        const query = `
            SELECT *
            FROM matches
            WHERE bracket_id = $1
        `;
        const values = [bracketId];
        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching matches of bracket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/:bracketId/teams", async (req, res) => {
    try {
        const bracketId = req.params.bracketId;
        const { teamIds } = req.body;
        const query = `
            INSERT INTO bracket_teams (bracket_id, team_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [bracketId, teamIds];
        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (error) {
        console.error('Error inserting into bracket_teams:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/:bracketId/finalize", async (req, res) => {
    try {
        console.log("finalize starting")
        const bracketId = req.params.bracketId;
        const { addedTeams } = req.body;
        console.log(bracketId, addedTeams)
        // randomize the order
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        shuffleArray(addedTeams);

        // get the length
        const totalTeams = addedTeams.length

        // figure out the number of rounds
        const totalRounds = Math.ceil(Math.log2(totalTeams));

        // figure out the bracket size
        const maxMatchesInARound = Math.pow(2, totalRounds-1);
        console.log(addedTeams, totalTeams, totalRounds, maxMatchesInARound);

        // form the matches
        var matches = [];
        for (let numMatches=1; numMatches<=maxMatchesInARound; numMatches*=2) {
            var currRoundMatches = []
            var match;
            // index of round
            var roundIndexVal = totalRounds - Math.log2(numMatches);
            // name of round
            var roundVal = roundIndexVal;
            if (roundVal === totalRounds) {
                roundVal = "Finals"
            } 
            if (roundVal === totalRounds - 1) {
                roundVal = "Semifinals"
            }

            // so index starts at 0
            var roundIndexVal = roundIndexVal - 1;

            for (let i = 0; i < numMatches; i += 1) {
                // index of match in round
                var matchInRoundIndexVal = i
                var team1ID = null;
                var team2ID = null;
                if (numMatches === maxMatchesInARound ) {
                    if (2*i < totalTeams) {
                        team1ID = addedTeams[2*i]
                    }
                    if (2*i+1 < totalTeams) {
                        team2ID = addedTeams[2*i+1]
                    }
                }
                var nextMatchID = null;
                // only the final should return null ig
                nextMatchID = matches[matches.length - 1] ? matches[matches.length - 1][Math.floor(i/2)].match_id : null

                const query = `
                INSERT INTO matches (bracket_id, team1_id, team2_id, location, round, round_index, match_in_round_index, next_match_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
                `;
                const values = [bracketId, team1ID, team2ID, "N/A", roundVal, roundIndexVal, matchInRoundIndexVal, nextMatchID];
                const { rows } = await pool.query(query, values);
                match = rows[0];
                currRoundMatches.push(match)
            }
            matches.push(currRoundMatches)
        }
        console.log("passed adding to matches")
        console.log(matches)

        // loop through each team in addedTeams to add to bracket_teams
        for (let i=0; i<addedTeams.length; i++) {
            const addedTeam = addedTeams[i]
            const query = `
            INSERT INTO bracket_teams (bracket_id, team_id)
            VALUES ($1, $2)
            RETURNING *
            `;
            const values = [bracketId, addedTeam];
            const { rows } = await pool.query(query, values);
        }
        console.log("passed adding to bracket_teams")
        res.json(matches)
        
    } catch (error) {
        console.error('Error finalizing bracket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router