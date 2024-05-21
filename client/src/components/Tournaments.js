import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import TournamentCard from './TournamentCard';
import TournamentFormModal from './TournamentFormModal';

const Tournaments = ({ setAuth }) => {
    const [currTournaments, setCurrTournaments] = useState(null);
    const [pastTournaments, setPastTournaments] = useState(null);
    const [showModal, setShowModal] = useState(false);

    async function getTournaments() {
        try {
            const response1 = await fetch("http://localhost:4000/tournaments", {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response1.json()

            // filter active tournaments and inactive tournaments, and set the state
            const activeTournaments = parseRes.filter(t => t.is_active)
            const inactiveTournaments = parseRes.filter(t => !t.is_active)
            setPastTournaments(inactiveTournaments)
            setCurrTournaments(activeTournaments)
            console.log(currTournaments)
            console.log(pastTournaments)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getTournaments();
    }, []);

    return (
        <div>
            <h4>Current Tournaments</h4>
            <div id="curr-tournaments">
                <div id="curr-tournament-card-list">
                {
                    currTournaments && currTournaments.length > 0 ? 
                    currTournaments.map(t => (
                        // get number of teams in tournament
                        <Link to={`/tournaments/${t.tournament_id}`} key={t.tournament_id}>
                            <TournamentCard key={t.tournament_id} tournament={t}/>
                        </Link>
                    )) :
                    currTournaments ? <p>No current tournaments</p> : <p>Loading...</p>
                }
                </div>
                <button onClick={() => setShowModal(true)}>Add a tournament</button>
                <TournamentFormModal isOpen={showModal} toggleModal={setShowModal} />
            </div>
            <h4>Past Tournaments</h4>
            <div id="past-tournaments">
                {
                    pastTournaments && pastTournaments.length > 0 ? 
                    pastTournaments.map(t => (
                        <Link to={`/tournaments/${t.tournament_id}`} key={t.tournament_id}>
                            <TournamentCard key={t.tournament_id} tournament={t}/>
                        </Link>
                    )) :
                    pastTournaments ? <p>No past tournaments</p> : <p>Loading...</p>
                }

            </div>
        </div>
    )
}

export default Tournaments;