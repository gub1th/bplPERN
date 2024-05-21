import React from 'react';
import './ProfilePage.css';
import ProfileStatCard from './ProfileStatCard';

const defaultProfileImg = require('../images/defaultProfile.png');

const ProfilePage = () => {
    // Dummy values for the profile
    const dummyProfile = {
        firstName: "DANIEL",
        lastName: "GUNAWAN",
        nickname: "The Island Boy",
        team: "the perminators",
        cpg: 4.9,
        winRate: "80%",
        chips: 3,
        totalWins: 8,
        playoffAppearances: 3,
        homeAwayRatio: 0.8,
        totalLosses: 2,
        furthestGone: "QF (S22)",
        bestVenue: "The House",
    };

    return (
        <div className="profile-page">
            {/* Profile Header */}
            <div id="profile-header">
                <img id="profile-image" src={defaultProfileImg} alt="Profile" />
                <div id="profile-info">
                    <h1 className="profile-name">{`${dummyProfile.firstName}`}</h1>
                    <h1 className="profile-name">{`${dummyProfile.lastName}`}</h1>
                    <p id="profile-nickname">{`"${dummyProfile.nickname}"`}</p>
                </div>
                <div id="profile-team-info">
                    <p className="profile-team-info-text inter-bold" >current team</p>
                    <p className="profile-team-info-text">{dummyProfile.team}</p>
                </div>
            </div>

            {/* Profile Stats */}
            <div id="profile-stats">
                <ProfileStatCard title="cpg" value={dummyProfile.cpg}/>
                <ProfileStatCard title="win rate" value={dummyProfile.winRate}/>
                <ProfileStatCard title="chips" value={dummyProfile.chips}/>
            </div>

            {/* ... Other profile components ... */}
        </div>
    );
};

export default ProfilePage;