import React, { useEffect, useState } from 'react';
import './TournamentCard.css'

const TournamentCard = ({ tournament }) => {
    const [teamCount, setTeamCount] = useState(0);

    async function fetchTeamCount() {
        try {
            const response = await fetch(`http://localhost:4000/tournaments/${tournament.tournament_id}/team-count`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            console.log("numba")
            console.log(parseRes)

            setTeamCount(parseRes)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        fetchTeamCount()
    })

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{tournament.name}</h5>
                <p className="card-text">{teamCount} teams</p>
            </div>
        </div>
    )
}

export default TournamentCard;