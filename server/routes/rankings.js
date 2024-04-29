const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

const { v4: uuidv4 } = require('uuid');

// get particular profile
router.get("/profile", authorization, async(req, res) => {
    try {
        console.log("WE ARE HERE FOR GETTING PROFILE")
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user])
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
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user])
        const profileId = profile.rows[0].profile_id
        console.log(profileId)
        const rankedProfilesPostgres = await pool.query("SELECT DISTINCT p.* FROM profiles as p JOIN individual_rankings as r ON p.profile_id = r.ranked_profile_id WHERE r.ranked_by_profile_id=$1", [profileId])
        const rankedProfiles = rankedProfilesPostgres
        console.log("heee")
        console.log(rankedProfiles.rowCount)
        res.json(rankedProfiles.rows)
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

router.post("/finalize", authorization,async(req, res) => {
    //convert the state (req.body) to an object after it was json stringified
    console.log("finalize starting")
    state = req.body
    console.log(2222)
    rankedColumn = state.columns['column-1']
    console.log(rankedColumn)
    console.log(3333333)
    console.log(rankedColumn.playerIds)
    // sort based on rank in descending order
    var sortedPlayerIds = rankedColumn.playerIds.sort((a, b) => {
        const rankingA = rankedColumn.playerIds.indexOf(a)
        const rankingB = rankedColumn.playerIds.indexOf(b)
        return rankingA - rankingB
    })
    console.log("4444")
    console.log(sortedPlayerIds)

    const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user])
    const profileId = profile.rows[0].profile_id
    // for each player
    try { 
        for (const playerId of sortedPlayerIds) { // try to get the ranking object of that player
            console.log('starting loop')
            console.log(playerId)

            console.log(1)
            const ranking = await pool.query("SELECT * FROM individual_rankings WHERE ranked_profile_id = $1 AND ranked_by_profile_id = $2", [playerId, profileId])
            const oldPlayerRanking = ranking.rows[0] 
            var newPlayerRanking = ranking.rows[0]
            console.log(2)
            const newPlayerRank = rankedColumn.playerIds.indexOf(playerId) + 1
            console.log(playerId, profileId)
            // if it doesn't exist, create it
            if (!oldPlayerRanking) {
                newPlayerRankingObj = await pool.query("INSERT INTO individual_rankings (ranked_profile_id, ranked_by_profile_id, rank) VALUES ($1, $2, $3) RETURNING *",
                                                [playerId, profileId, newPlayerRank])
                newPlayerRanking = newPlayerRankingObj.rows[0]
                return res.status(200).json({ message: "Ranking added!" });
            }
            console.log(3)
            // if the old rank is the same as the new rank, no need to do anything
            if (oldPlayerRanking.rank === newPlayerRanking.rank) {
                console.log("here")
                return res.status(200).json({ message: "Rank not changed" });
            }

            console.log(4)
            // update the ranking in accordance with its position in column-1 playerIds index
            const newRanking = await pool.query("UPDATE individual_rankings SET rank = $3 WHERE ranked_profile_id = $1 AND ranked_by_profile_id = $2 RETURNING *",
                                                [playerId, profileId, newPlayerRank])
            console.log(5)
            return res.status(200).json({ message: "Rank updated successfully" });

        }

    } catch (err) {
        console.log(err.message)
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