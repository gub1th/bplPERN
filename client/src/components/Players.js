import { React, useState } from 'react'
import './Players.css'

const Players = ({ setAuth }) => {

    const semifinalMatch1 = {
        round: "Semifinal",
        team1_id: "t1",
        team2_id: "t2",
        match_date: "Jan"
    }

    const semifinalMatch2 = {
        round: "Semifinal",
        team1_id: "t3",
        team2_id: "t4",
        match_date: "Feb"
    }

    const finalMatch1 = {
        round: "Final",
        team1_id: null,
        team2_id: null,
        match_date: "March"
    }

    const sampleRoundData = [
        [semifinalMatch1, semifinalMatch2],
        [finalMatch1],
    ]

    const sampleTeams = {
        "t1": "Team 1",
        "t2": "Team 2",
        "t3": "Team 3",
        "t4": "Team 4"
    }

    const [roundData, setRoundData] = useState([])
    return (
        <div className="container">
            <div className="tournament-bracket tournament-bracket--rounded">
                {/* loop through the different rounds*/}
                {sampleRoundData
                    .map(roundOfMatches => (
                        <div>
                            <h3 className="tournament-bracket__round-title">{roundOfMatches[0].round}</h3>
                            <ul className="tournament-bracket__list">
                                {roundOfMatches.map(currMatch => (
                                    <li className="tournament-bracket__item">
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
                                                            <span className="tournament-bracket__code">{sampleTeams[currMatch.team1_id]}</span>
                                                        </td>
                                                        <td className="tournament-bracket__score">
                                                            <span className="tournament-bracket__number">4</span>
                                                        </td>
                                                    </tr>
                                                    <tr className="tournament-bracket__team">
                                                        <td className="tournament-bracket__country">
                                                        <span className="tournament-bracket__code">{sampleTeams[currMatch.team2_id]}</span>
                                                        </td>
                                                        <td className="tournament-bracket__score">
                                                            <span className="tournament-bracket__number">1</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Players;