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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})