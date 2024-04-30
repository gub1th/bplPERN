import react from "react"
import './GeneralRankingCard.css';

export default function GeneralRankingCard({ elem, index }) {
    return (
        <div className="general-ranking-card">
            <div className="general-ranking-card-name">{elem.first_name} {elem.last_name}</div>
        </div>
    )
}