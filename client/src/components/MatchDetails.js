import react, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MatchDetails = () => {

    const [match, setMatch] = useState(null)
    const [matchTeams, setMatchTeams] = useState(null)
    const [matchPlayers, setMatchPlayers] = useState(null)
    const [matchFormData, setMatchFormData] = useState({
        date: null,
        location: null,
        homeTeamId: null,
        winnerId: null,
        sets: []
    })

    const { bracketId, matchId } = useParams();

    const handleAddSet = (event) => {
        event.preventDefault()
        const newSet = {
            set_number: matchFormData.sets.length + 1,
            score_team1: 0,
            score_team2: 0,
            winning_team_id: null
        }
        setMatchFormData((prevState) => ({
            ...prevState,
            sets: [...prevState.sets, newSet]
        }))
    }

    const handleRemoveSet = (event) => {
        event.preventDefault()
        if (matchFormData.sets.length === 0) return
        setMatchFormData((prevState) => ({
            ...prevState,
            sets: prevState.sets.slice(0, -1)
        }))
    }

    const handleScoreChange = (team, setIndex, newScore) => {
        const updatedSets = [...matchFormData.sets]
        if (team === "t1") {
            updatedSets[setIndex].score_team1 = newScore
        } else if (team === "t2") {
            updatedSets[setIndex].score_team2 = newScore
        } else {
            console.log("invalid")
            return
        }

        setMatchFormData((prevState) => ({
            ...prevState,
            sets: updatedSets
        }))
    }

    const onSubmitForm = async(e) => {
        e.preventDefault()

        try {
            const response = await fetch(`http://localhost:4000/matches/${matchId}`, {
                method: "PATCH",
                headers: { token: localStorage.token, 'Content-Type': 'application/json' },
                body: JSON.stringify(matchFormData)
            })

            const parseRes = await response.json()
            console.log(parseRes)
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }

    async function fetchMatch() {
        try {
            const response = await fetch(`http://localhost:4000/matches/${matchId}`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            setMatch(parseRes)
            setMatchFormData({
                date: parseRes.match_date,
                location: parseRes.location,
                homeTeamId: parseRes.home_team_id,
                winnerId: parseRes.winner_id
            })
            return parseRes  
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }

    async function fetchMatchSets() {
        try {
            const response = await fetch(`http://localhost:4000/matches/${matchId}/matchSets`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            // order the sets by set id
            const condensedSets = parseRes.sort((a, b) => a.set_number - b.set_number)
                    .map(setz => ({
                        score_team1: setz.score_team1,
                        score_team2: setz.score_team2,
                        set_number: setz.set_number,
                        winning_team_id: setz.winning_team_id
                    }))
            setMatchFormData({
                ...matchFormData,
                sets: condensedSets
            })
            return condensedSets  
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }

    async function fetchMatchTeams() {
        try {
            const response = await fetch(`http://localhost:4000/matches/${matchId}/teams`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            setMatchTeams(parseRes)
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }

    async function fetchMatchPlayers() {
        try {
            const response = await fetch(`http://localhost:4000/matches/${matchId}/players`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            setMatchPlayers(parseRes)
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }

    useEffect(() => {
        fetchMatch()
    }, [])

    useEffect(() => {
        fetchMatchSets()
        fetchMatchTeams()
        fetchMatchPlayers()
    }, [match])

    return (
        <div>
            <h1>Match Details</h1>
            {match && matchFormData && matchFormData.sets && matchTeams && matchPlayers ? (
                <div>
                    <form onSubmit={onSubmitForm}>
                        <label>
                            Date
                           <DatePicker 
                                selected={matchFormData.date}
                                onChange={date => setMatchFormData({ ...matchFormData, date })}
                                dateFormat="yyyy-MM-dd"
                           />
                        </label>
                        <label>
                            Location
                            <input type="text" name="location" value={matchFormData.location} onChange={e => setMatchFormData({ ...matchFormData, location: e.target.value })}/>
                        </label>
                        <label>
                            Home/Away
                            <select name="homeTeamId" value={matchFormData.homeTeamId} onChange={e => setMatchFormData({ ...matchFormData, homeId: e.target.value })}>
                                {matchTeams
                                    .map(team => 
                                        <option key={team.team_id} value={team.team_id}>
                                            {team.name}
                                        </option>
                                    )}
                            </select>
                        </label>
                        <label>
                            Winner
                            <select name="winnerId" value={matchFormData.winnerId} onChange={e => setMatchFormData({ ...matchFormData, winnerId: e.target.value })}>
                                {matchTeams
                                    .map(team => 
                                        <option key={team.team_id} value={team.team_id}>
                                            {team.name}
                                        </option>
                                    )}
                            </select>
                        </label>
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Team Name</th>
                                    {matchFormData.sets.length > 0 && matchFormData.sets.map((set, setIndex) => (
                                        <th>Set {String(set.set_number)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {matchTeams[0].name}
                                    </td>
                                    {matchFormData.sets.map((set, setIndex) => (
                                        <td key={setIndex}>
                                            <input type="number" value={set.score_team1} onChange={e => handleScoreChange("t1", setIndex, parseInt(e.target.value))} />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td>
                                        {matchTeams[1].name}
                                    </td>
                                    {matchFormData.sets.map((set, setIndex) => (
                                        <td key={setIndex}>
                                            <input type="number" value={set.score_team2} onChange={e => handleScoreChange("t2", setIndex, parseInt(e.target.value))} />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        <button onClick={e => handleAddSet(e)}>Add Set</button>
                        <button onClick={e => handleRemoveSet(e)}>Remove Set</button>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            ) : (<div>Loading</div>)}
            
        </div>
    )
}

export default MatchDetails