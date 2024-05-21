const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")

const PORT = process.env.PORT || 4000

// middleware
app.use(cors());
app.use(express.json());

// register and login routes
app.use("/auth", require("./routes/jwtAuth"))

// dashboard route
app.use("/dash", require("./routes/dashboard"))

// ranking route
app.use("/rankings", require("./routes/rankings"))

// tournament route
app.use("/tournaments", require("./routes/tournaments"))

// bracket route
app.use("/brackets", require("./routes/brackets"))

// profile route
app.use("/profiles", require("./routes/profiles"))

// team route
app.use("/teams", require("./routes/teams"))

// match route
app.use("/matches", require("./routes/matches"))

// set route
app.use("/matchSets", require("./routes/matchSets"))

// oauth route
app.use("/oauth", require("./routes/oauth"))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})