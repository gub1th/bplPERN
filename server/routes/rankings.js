const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// get particular profile
router.get("/profile", authorization, async(req, res) => {
    try {
        console.log("WE ARE HERE FOR GETTING PROFILE")
        console.log(req)
        console.log(req.user)
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user])
        console.log(profile.rows[0].profile_id)
        res.json(profile.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get all profiles
router.get("/profiles", authorization, async(req, res) => {
    try {
        const profiles = await pool.query("SELECT * FROM profiles")
        console.log(profiles.rows)
        res.json(profiles.rows)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get ranked profiles
router.get("/ranked-profiles", authorization, async(req, res) => {
    try {
        const rankedProfilesPostgres = await pool.query("SELECT DISTINCT p.* FROM profiles as p JOIN individual_rankings as r ON p.profile_id = r.ranked_profile_id WHERE p.user_id=$1", [req.user])
        const rankedProfiles = rankedProfilesPostgres.rows
        res.json(rankedProfiles)
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

// get specific ranking based on playerId provided
router.get("/:playerId", authorization, async(req, res) => {
    try {
        const { playerId } = req.params
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user]);
        const profileId = profile.rows[0].profile_id;
        const ranking = await pool.query("SELECT * FROM individual_rankings WHERE ranked_profile_id = $1 AND ranked_by_profile_id = $2", [playerId, profileId])
        res.json(ranking.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

router.post("/", authorization,async(req, res) => {
    try {
        const { ranked_profile_id, rank } = req.body
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user]);
        const profileId = profile.rows[0].profile_id;
        const newRanking = await pool.query(
            "INSERT INTO individual_rankings (ranked_profile_id, ranked_by_profile_id, rank) VALUES ($1, $2, $3) RETURNING *",
            [ranked_profile_id, , profileId, rank]
        )
        res.json(newRanking.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

router.put("/:playerId", async (req, res) => {
    try {
      const { playerId } = req.params;
      const { rank } = req.body;
  
      const updateQuery = `UPDATE individual_rankings SET rank = $1 WHERE ranked_profile_id = $2`;
      await pool.query(updateQuery, [rank, playerId]);
  
      res.status(200).json({ message: "Rank updated successfully" });
    } catch (err) {
      console.error("Error updating rank:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

// router.post("/update-rankings", async(req, res) => {
//     try {
//         // create the ranking if it doesn't exist
//         const { ranked_profile_id, ranking } = req.body
//         const updateRanking = await pool.query(
//             "INSERT INTO individual_rankings (ranked_profile_id, ranking) VALUES ($1, $2) RETURNING *",
//             [ranked_profile_id, ranking]
//         )
//         res.json(updateRanking.rows[0])
        
//         // recompute the rankings of the ones below it

//     } catch (err) {
//         console.log(err.message)
//         res.status(500).json("Server error")

//     }
// })

// router.post("/optin", authorization, async (req, res) => {
//     try {
//         var { opt_in } = req.body;
//         opt_in = Boolean(opt_in);
//         console.log(opt_in, req.user)
//         const updateOptIn = await pool.query(   
//             "UPDATE profiles SET opt_in = $1 WHERE user_id = $2 RETURNING *",
//             [opt_in, req.user]
//         );
//         res.json(updateOptIn.rows[0]);
//         console.log("dont fuck me")
//     } catch (err) {
//         console.log("fuck me ")
//         console.log(err.message);
//         res.status(500).json("Server error");
//     }
// });

module.exports = router