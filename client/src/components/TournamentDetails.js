import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./TournamentDetails.css";
import { Link, useNavigate } from "react-router-dom";
import BracketCard from "./BracketCard";

const TournamentDetails = () => {
    const { tournamentId } = useParams();

    const [profile, setProfile] = useState(null);
    const [tournament, setTournament] = useState(null);
    const [currBrackets, setCurrBrackets] = useState(null);
    const [tournamentTeams, setTournamentTeams] = useState(null);
    const [playerProfiles, setPlayerProfiles] = useState(null);


    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        team_name: "",
        other_team_member: "",
    });

    const onChange = e => {
        console.log(e.target.name)
        console.log(e.target.value)
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { ...inputs };
            const response = await fetch(`http://localhost:4000/teams`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json()
            const response2 = await fetch(`http://localhost:4000/tournaments/${tournament.tournament_id}/teams`, {
                method: "POST",
                headers: { token: localStorage.token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ team_id: parseRes.team_id })
            })
            const parseRes2 = await response2.json();
            console.log(parseRes2);
        } catch (err) {
            console.error(err.message);
        }
    };

    async function getProfile() {
        try {
            const response = await fetch("http://localhost:4000/rankings/profile", {
                method: "GET",
                headers: { token: localStorage.token }
            })

            const parseRes = await response.json()
            setProfile(parseRes)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function addBracketLogic() {
        try {
            console.log("adding bracket start")
            const response = await fetch(`http://localhost:4000/brackets`, {
                method: "POST",
                headers: { token: localStorage.token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ tournament_id: tournament.tournament_id})
            })
            const parseRes = await response.json()
            console.log(parseRes)

            // change registration status if necessary
            const response2 = await fetch(`http://localhost:4000/tournaments/${tournament.tournament_id}`, {
                method: "PATCH",
                headers: { token: localStorage.token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ "register_is_open": false})
            })

            var parseRes2;
            if (tournament.register_is_open) {
                parseRes2 = await response2.json()
            }
            console.log(parseRes)

            navigate(`/brackets/${parseRes.bracket_id}?mode=init`);

        } catch (err) {
            console.log(err.message)
            console.log("ADSAD")
        }
    } 


    async function fetchTournamentTeams() {
        console.log("fetch tournamentteams")
        try {
            const response = await fetch(`http://localhost:4000/tournaments/${tournament.tournament_id}/teams`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            console.log(parseRes)

            setTournamentTeams(parseRes)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function fetchPlayers() {
        console.log("fetch players")
        try {
            const response = await fetch(`http://localhost:4000/profiles`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            console.log(parseRes)

            setPlayerProfiles(parseRes)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function fetchBrackets() {
        console.log("fetch brackets")
        console.log(tournament)
        try {
            const response = await fetch(`http://localhost:4000/tournaments/${tournament.tournament_id}/brackets`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            console.log("brackets!")
            console.log(parseRes)
            setCurrBrackets(parseRes)
            console.log(tournament)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function fetchTournament() {
        console.log("fetchTournament")
        try {
            const response1 = await fetch("http://localhost:4000/tournaments/" + tournamentId, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response1.json()
            console.log("tourne")
            console.log(parseRes)
            return parseRes
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchTournament()
                setTournament(result)
                await getProfile()
                await fetchPlayers()
            } catch (err) {
                console.log(err.message)
            }
        }

        fetchData()
    }, [])


    useEffect(() => {
        const fetchDataBasedOnState = async () => {
            try {
                await fetchBrackets()
                await fetchTournamentTeams()
            } catch (err) {
                console.log(err.message)
            }
        }

        fetchDataBasedOnState()
    }, [tournament])

    const handleButtonClick = () => {
        console.log(tournament);
        console.log(tournamentTeams);
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Log Tournament</button>
            <h1>Tournament Details</h1>
            {tournament && currBrackets && playerProfiles && tournamentTeams ? (
                <div>
                    <p>{tournament.name}. {tournamentTeams ? tournamentTeams.length : "idk how many"} teams. {tournament.is_active ? "Ongoing" : "Done"}.</p>
                    {tournament.register_is_open ? 
                        (
                            <>  
                                <p>Registration is active. Submit a registration</p>
                                <form onSubmit={handleSubmit}>
                                    <input type="text" placeholder="team name" value={inputs.team_name} name="team_name" onChange={onChange}/>
                                    <select id="other_team_member" name="other_team_member" value={inputs.other_team_member} onChange={onChange}>
                                        {playerProfiles
                                        .filter(currProfile => profile.profile_id !== currProfile.profile_id && !tournamentTeams.some(team => team.member1_id === currProfile.profile_id || team.member2_id === currProfile.profile_id))
                                        .map(currProfile => (
                                        <option key={currProfile.profile_id} value={currProfile.profile_id}>{currProfile.first_name + " " + currProfile.last_name}</option>
                                        ))}
                                    </select>
                                    <button type="submit">Submit</button>
                                </form>
                            </>
                            
                        ) : 
                        (<p>Registration has closed!</p>)
                    }
                    <div id="main-content">
                    <div id="curr-bracket-card-list">
                        <h3>brackets</h3>
                        {
                            currBrackets && currBrackets.length > 0 ? 
                            currBrackets.map(b => (
                                // get number of teams in tournament
                                <Link to={`/brackets/${b.bracket_id}?mode=view`} key={b.bracket_id}>
                                    <BracketCard key={b.bracket_id} bracket={b}/>
                                </Link>
                            )) :
                            currBrackets ? <p>No current brackets</p> : <p>Loading...</p>
                        }
                        <button id="add-bracket-button" onClick={async () => await addBracketLogic()}>Add Bracket</button>
                    </div>
                        <div id="team-content">
                            <h3>teams</h3>
                            {// display teams
                            tournamentTeams && tournamentTeams.length > 0 ? (
                                tournamentTeams.map(t => (
                                    <p key={t.team_id}>{t.name} </p>
                                ))
                            ) : (
                                <p>No teams</p>
                            )}

                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading tournament details...</p>
            )}
        </div>
    )
}

export default TournamentDetails;