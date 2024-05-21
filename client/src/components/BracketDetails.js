import React, { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from "react-router-dom"
import './BracketDetails.css'

const BracketDetails = () => {

    const { bracketId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const mode = searchParams.get('mode')
    console.log(bracketId, mode)

    const [bracket, setBracket] = useState(null);

    const [tournament, setTournament] = useState(null)
    const [tournamentTeams, setTournamentTeams] = useState(null);
    const [bracketTeams, setBracketTeams] = useState([]);
    const [addedTeams, setAddedTeams] = useState([]);
    const [teamStandings, setTeamStandings] = useState([]);
    const [activeTab, setActiveTab] = useState('infotab');
    const [inputs, setInputs] = useState({
        bracket_name: "",
        bracket_type: "",
        teamToAdd: ""
    });

    const [matches, setMatches] = useState([]);
    const [matchSets, setMatchSets] = useState([]);

    const onChange = e => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    async function fetchBracket() {
        try {
            const response = await fetch(`http://localhost:4000/brackets/${bracketId}`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            return parseRes  
        } catch (err) {
            console.log(err.message)
            throw err;
        }
    }

    const fetchSets = async() => {
        try {
            const response = await fetch(`http://localhost:4000/matchSets`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            return parseRes  
        } catch (err) {
            console.log(err.message)
        }
    }

    const fetchBracketMatches = async() => {
        try {
            const response = await fetch(`http://localhost:4000/brackets/${bracketId}/matches`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            console.log(parseRes)
            // convert this into the proper format
            // result will be a 2d list. all match (object) in a sublist will have the same round_index
            // each sublist will be sorted in ascending order by match_in_round_index

            // Group the matches by round_index
            const groupedMatches = {}
            parseRes.forEach(match => {
                if (!groupedMatches[match.round_index]) {
                    groupedMatches[match.round_index] = []
                }
                groupedMatches[match.round_index].push(match)
            })
            console.log(groupedMatches)

            // convert to a list, sorted by round_index
            const result = Object.keys(groupedMatches)
                .sort((a, b) => a - b)
                .map(key => groupedMatches[key]);

            console.log(result)
            // sort the inner lists by match_in_round_index
            const result2 = result.map(matches => {
                return matches.sort((a, b) => a.match_in_round_index - b.match_in_round_index);
            });
            console.log(result2)

            setMatches(result2)
        } catch (err) {
            console.log(err.message)
        }
    }
    const fetchBracketTeams = async() => {
        try {
            const response = await fetch(`http://localhost:4000/brackets/${bracket.bracket_id}/teams`, {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            console.log(parseRes)

            setBracketTeams(parseRes)
            setAddedTeams(parseRes.filter(team => team.added));
        } catch (err) {
            console.log(err.message)
        }
    }

    async function fetchTournamentOfBracket() {
        console.log("fetchTournament")
        try {
            const response1 = await fetch(`http://localhost:4000/brackets/${bracket.bracket_id}/tournament`, {
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
            setInputs({...inputs, teamToAdd: parseRes.length > 0 ? parseRes[0].team_id : ""})
        } catch (err) {
            console.log(err.message)
        }
    }

    async function finalizeBracket() {
        try {
            console.log("finalize-1")
            if (addedTeams.length < 2) {
                console.log("not enough teams")
                return
            } 
            console.log("finalize=2")
            const response = await fetch(`http://localhost:4000/brackets/${bracket.bracket_id}/finalize`, {
                method: "POST",
                headers: { token: localStorage.token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ addedTeams, bracketName: inputs.bracket_name, bracketType: inputs.bracket_type })
            })
            console.log("finalize 3")
            const parseRes = await response.json()
            console.log(parseRes)
        } catch (err) {
            console.log(err.message)
        }
    }

    function addTeamToState() {
        console.log(inputs)
        console.log(bracketTeams)
        console.log(addedTeams)
        if (bracketTeams.find(team => team.team_id === inputs.teamToAdd)) return
        
        setBracketTeams(prevTeams => [...prevTeams, inputs.teamToAdd]);
        setAddedTeams(prevTeams => [...prevTeams, inputs.teamToAdd]);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBracket(await fetchBracket())
                await fetchBracketMatches()
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setMatchSets(await fetchSets())
                await fetchBracketTeams()
                setTournament(await fetchTournamentOfBracket())
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchData()
    }, [bracket])

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchTournamentTeams()
            } catch (err) {
                console.log(err.message)
            }
        }
        fetchData()
    }, [tournament])

    return (
        <div id="bracket-details-container">
            <button onClick={() => console.log(addedTeams, tournamentTeams, bracketTeams, matches)}>print</button>
            <div id="bracket-details-header">
                {mode === "init" ? (
                <h1>New Bracket</h1>
                ) : (
                <h1>{bracket ? (bracket.name ? bracket.name : inputs.bracket_name ? inputs.bracket_name : "not sure") : "loading.."}. {bracket ? (bracket.bracket_type ? bracket.bracket_type : inputs.bracket_type ? inputs.bracket_type : "not sure") : "loading.."}. {bracketTeams ? bracketTeams.length : "idk how many"} teams.</h1>
                )}
            </div>
            <div id="bracket-details-content">
                <div id="bracket-details-left">
                    { mode === "init" ? (
                        <>
                            <div>
                                <button onClick={() => setActiveTab('infotab')}>info</button>
                                <button onClick={() => setActiveTab('teamstab')}>teams</button>
                            </div>

                            {activeTab === 'infotab' ? (
                                <div>
                                    <form>
                                        <h3>bracket name</h3>
                                        <input
                                            type="text"
                                            name="bracket_name"
                                            placeholder="groups"
                                            value={inputs.bracket_name}
                                            onChange={onChange}
                                        />
                                        
                                        <h3>bracket type</h3>
                                        <select id="bracket_type" name="bracket_type" value={inputs.bracket_type} onChange={onChange}>
                                            <option key="bracket_type_option_1" value="round_robin">round robin</option>
                                            <option key="bracket_type_option_2" value="single_elimination">single elimination</option>
                                            <option key="bracket_type_option_3" value="double_elimination">double elimination</option>
                                        </select>
                                        
                                        <button onClick={async () => await finalizeBracket()}>Start Bracket</button>
                                    </form>
                                </div>
                                

                            ) : (
                                <>  
                                    {addedTeams?.map(teamId => {
                                        const team = tournamentTeams.find(team => team.team_id === teamId);
                                        return (
                                            <div>
                                                <h3>{team.name}</h3>
                                            </div>
                                        );
                                    })}
                                    <h3>Teams not added</h3>
                                    <select id="team-dropdown" name="teamToAdd" value={inputs.teamToAdd} onChange={onChange}>
                                        {tournamentTeams.filter(team => !addedTeams.includes(team.team_id)).map(team => (
                                            <option key={team.team_id} value={team.team_id}>{team.name}</option>
                                        ))}
                                    </select>
                                    <button type="submit" onClick={() => addTeamToState()}>Add Team</button>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <h1>current standings.</h1>
                            <table>
                                <tr>
                                    <th>No</th>
                                    <th>Team</th>
                                    <th>Wins</th>
                                    <th>Losses</th>
                                    <th>Cup Diff</th>
                                </tr>
                                {teamStandings.map((teamObj, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{String(index+1)}</td>
                                            <td>{teamObj.name}</td>
                                            <td>{teamObj.wins}</td>
                                            <td>{teamObj.losses}</td>
                                            <td>{teamObj.cupDiff}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </>
                    )}
                </div>
                <div id="bracket-details-right">
                    <div className="container">
                        <div className="tournament-bracket tournament-bracket--rounded">
                            {/* loop through the different rounds*/}
                            {matches.length > 0 ? matches
                                .map(roundOfMatches => (
                                    <div>
                                        <h3 className="tournament-bracket__round-title">{roundOfMatches[0].round}</h3>
                                        <ul className="tournament-bracket__list">
                                            {roundOfMatches.map(currMatch => (
                                                <li className="tournament-bracket__item">
                                                    <Link to={`/brackets/${bracket.bracket_id}/matches/${currMatch.match_id}`} className="tournament-bracket__link">
                                                        <div className="tournament-bracket__match" tabIndex="0">
                                                            <table className="tournament-bracket__table">
                                                                <caption className="tournament-bracket__caption">
                                                                    <time>{currMatch.match_date}</time>
                                                                </caption>
                                                                <thead className="sr-only">
                                                                    <tr>
                                                                        <th>Team</th>
                                                                        <th>Score</th>
                                                                    </tr>
                                                                </thead>  
                                                                <tbody className="tournament-bracket__content">
                                                                    <tr className="tournament-bracket__team tournament-bracket__team--winner">
                                                                        <td className="tournament-bracket__country">
                                                                            {/* <span className="tournament-bracket__code">
                                                                                {currMatch.team1_id !== null ?
                                                                                    (bracketTeams.find(team => team.team_id === currMatch.team1_id).name)
                                                                                    : "null"
                                                                                }
                                                                            </span> */}
                                                                            <span className="tournament-bracket__code">
                                                                                {bracketTeams.find(team => team.team_id === currMatch.team1_id)?.name}
                                                                            </span>
                                                                        </td>
                                                                        <td className="tournament-bracket__score">
                                                                            <span className="tournament-bracket__number">
                                                                            {
                                                                                matchSets
                                                                                    .filter(set => set.match_id === currMatch.match_id && set.winning_team_id === currMatch.team1_id)
                                                                                    .length
                                                                            }
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="tournament-bracket__team">
                                                                        <td className="tournament-bracket__country">
                                                                        <span className="tournament-bracket__code">
                                                                            {bracketTeams.find(team => team.team_id === currMatch.team2_id)?.name}
                                                                        </span>
                                                                        </td>
                                                                        <td className="tournament-bracket__score">
                                                                            <span className="tournament-bracket__number">
                                                                                {
                                                                                    matchSets
                                                                                        .filter(set => set.match_id === currMatch.match_id && set.winning_team_id === currMatch.team2_id)
                                                                                        .length
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                                : "no teams. no bracket."
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BracketDetails