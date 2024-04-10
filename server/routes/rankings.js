const router = require("express").Router()
const pool = require("../db")
const authorization = require("../middleware/authorization")

// this is the same one as in dashboard.js, should refactor later. just tryna get profile
router.get("/", authorization, async(req, res) => {
    try {
        const profile = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user])
        console.log(profile.rows[0].profile_id)
        res.json(profile.rows[0])
    } catch (err) {
        console.log(err.message)
        res.status(500).json("Server error")
    }
})

router.post("/optin", authorization, async (req, res) => {
    try {
        var { opt_in } = req.body;
        opt_in = Boolean(opt_in);
        console.log(opt_in, req.user)
        const updateOptIn = await pool.query(   
            "UPDATE profiles SET opt_in = $1 WHERE user_id = $2 RETURNING *",
            [opt_in, req.user]
        );
        res.json(updateOptIn.rows[0]);
        console.log("dont fuck me")
    } catch (err) {
        console.log("fuck me ")
        console.log(err.message);
        res.status(500).json("Server error");
    }
});

module.exports = router