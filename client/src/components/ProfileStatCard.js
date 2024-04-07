import React from 'react';
import './ProfileStatCard.css';

function ProfileStatCard({ title, value }) {
    return (
        <div className="card">
            <h2 id="value">{value}</h2>
            <h1 id="title">{title}</h1>
        </div>
    )
}

export default ProfileStatCard;