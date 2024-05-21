const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// get all tournaments
router.get("/", authorization, async(req, res) => {
    try {
        const tournaments = await pool.query("SELECT * FROM tournaments")
        res.json(tournaments.rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get one tournament
router.get("/:tournamentId", authorization, async(req, res) => {
    try {
        console.log("HEREEE")
        const { tournamentId } = req.params
        const tournament = await pool.query("SELECT * FROM tournaments WHERE tournament_id = $1", [tournamentId])
        res.json(tournament.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// add a tournament
router.post("/", authorization, async(req, res) => {
    try {
        const { name, start_date, end_date, active } = req.body
        const addTournament = await pool.query(
            "INSERT INTO tournaments (name, start_date, end_date, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, start_date, end_date, active]
        )
        res.json(addTournament.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// delete a tournament
router.delete("/:tournamentId", authorization, async(req, res) => {
    try {
        const tournamentId = req.params.tournamentId
        const deleteTournament = await pool.query(
            "DELETE FROM tournaments WHERE tournament_id = $1 RETURNING *",
            [tournamentId]
        )
        res.json(deleteTournament.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

router.patch("/:tournamentId", authorization, async(req, res) => {
    try {
        const tournamentId = req.params.tournamentId
        const updates = req.body
        console.log("HEHHEHE\n\n\n\n\n\n\n")
        console.log("HEHHEHE\n\n\n\n\n\n\n")
        // const updateTournament = await pool.query(
        //     "UPDATE tournaments SET ? WHERE tournament_id = $2 RETURNING *",
        //     [updates, tournamentId]
        // )
        const updateQuery = `UPDATE tournaments SET ${Object.entries(updates)
            .map(([key, val]) => `${key} = ${val}`)
            .join(", ")} WHERE tournament_id = $1 RETURNING *`;
        const updateTournament = await pool.query(updateQuery, [tournamentId]);
        console.log(updateTournament.rows[0])
        res.json(updateTournament.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// update a tournament
router.put("/:tournamentId", authorization, async(req, res) => {
    try {
        const tournamentId = req.params.tournamentId
        const { name, start_date, end_date, active } = req.body
        const updateTournament = await pool.query(
            "UPDATE tournaments SET name = $1, start_date = $2, end_date = $3, is_active = $4 WHERE tournament_id = $5 RETURNING *",
            [name, start_date, end_date, active, tournamentId]
        )
        res.json(updateTournament.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get teams of a particular tournament
router.get('/:tournamentId/teams', async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const query = `
            SELECT * FROM teams JOIN tournament_teams ON teams.team_id = tournament_teams.team_id
            WHERE tournament_id = $1
        `;
        const values = [tournamentId];
        const { rows } = await pool.query(query, values);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching teams of tournament:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// get team count of a particular tournament (prob replace with above later on)
router.get('/:tournamentId/team-count', async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const query = `
            SELECT COUNT(*) AS team_count
            FROM tournament_teams
            WHERE tournament_id = $1
        `;
        const values = [tournamentId];
        const { rows } = await pool.query(query, values);
        const teamCount = rows[0].team_count;
        res.json(teamCount);
    } catch (error) {
        console.error('Error fetching team count:', error);
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
        console.error('Error fetching team count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// adding a team to a tournament
router.post('/:tournamentId/teams', async (req, res) => {
    try {
        const tournamentId = req.params.tournamentId;
        const { team_id } = req.body;
        const query = `
            INSERT INTO tournament_teams (tournament_id, team_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [tournamentId, team_id];
        const { rows } = await pool.query(query, values);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error adding team to tournament:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router