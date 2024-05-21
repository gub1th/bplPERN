import React, { useEffect, useState } from 'react';
import './BracketCard.css'

// this a copy of tournament card
const BracketCard = ({ bracket }) => {
    const [teamCount, setTeamCount] = useState(0);

    async function fetchTeamCount() {
        try {
            const response = await fetch(`http://localhost:4000/brackets/${bracket.bracket_id}/teams`, {
                method: "GET",
                headers: { token: localStorage.token, 'Content-Type': 'application/json' }
            })
            const parseRes = await response.json()
            console.log(parseRes.length)

            setTeamCount(parseRes.length)
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
                <h5 className="card-title">{bracket.name}</h5>
                <p className="card-text">{teamCount} teams</p>
            </div>
        </div>
    )
}

export default BracketCard;