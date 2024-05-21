import react from "react"
import './GeneralRankingCard.css';

export default function GeneralRankingCard({ elem, index }) {
    return (
        <div className="general-ranking-card">
            <span>{index+1}</span>
            <span>{elem.first_name + " " + elem.last_name}</span>
            <span>{elem.sum}</span>
        </div>
    )
}