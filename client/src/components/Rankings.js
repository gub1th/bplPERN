import React, { useEffect, useState } from "react";
import Column from './Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import GeneralRankingCard from "./GeneralRankingCard";
import "./Rankings.css";


const Rankings = ({ setAuth }) => {
    const [profile, setProfile] = useState(null);
    const [state, setState] = useState(null);
    const [generalRankings, setGeneralRankings] = useState(null)

    const finalizeRankings = async() => {
        try {
            const response = await fetch ("http://localhost:4000/rankings/finalize", {
            method: "POST",
            headers: { token: localStorage.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(state),
        })
        } catch (err) {
            console.log(err.message)
        }
        
    }

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

    async function getInitialData() {
        try {
            // get id, first name, last name (and image) of all all profiles.
            const response1 = await fetch("http://localhost:4000/rankings/profiles", {
                method: "GET",
                headers: { token: localStorage.token }
            })

            // get own profile 
            const responseP = await fetch("http://localhost:4000/rankings/profile", {
                method: "GET",
                headers: { token: localStorage.token }
            })

            const userProfile = await responseP.json()

            const allProfiles = await response1.json()

            // convert to a dict with this format: {'player-1': {id: 'player-1', first_name: 'daniel', last_namge, image},}
            const playersDict = {}
            for (let i = 0; i < allProfiles.length; i++) {
                playersDict[allProfiles[i].profile_id] = allProfiles[i]
            }

            // filter out own profile
            delete playersDict[userProfile.profile_id]

            // get ranked profiles
            const response2 = await fetch("http://localhost:4000/rankings/ranked-profiles", {
                method: "GET",
                headers: { token: localStorage.token }
            })

            var rankedProfiles = await response2.json()
            // sort ranked Profiles by rank
            rankedProfiles = rankedProfiles.sort((a, b) => a.rank - b.rank)
            // get ids of ranked profile. put in list
            var rankedProfileIds = []
            for (let i = 0; i < rankedProfiles.length; i++) {
                if (rankedProfiles[i].profile_id === userProfile.profile_id) {
                    continue
                }
                rankedProfileIds.push(rankedProfiles[i].profile_id)
            }
            
            // get ids of unranked profiles. put in list
            const unrankedProfileIds = Object.keys(playersDict).filter(key => !rankedProfileIds.includes(key))
            var currData = {
                players : playersDict,
                columns : {
                    'column-1': {
                        id: 'column-1',
                        title: 'Ranked',
                        playerIds: rankedProfileIds
                    },
                    'column-2': {
                        id: 'column-2',
                        title: 'Unranked',
                        playerIds: unrankedProfileIds
                    },
                },
                // facilitate ordering of columns
                columnOrder: ['column-1', 'column-2'],
            }
            setState(currData)

        } catch (err) {
            console.log(err.message)
        }
    }

    async function getGeneralRankings() {
        try {
            const response = await fetch("http://localhost:4000/rankings/general", {
                method: "GET",
                headers: { token: localStorage.token }
            })
            const parseRes = await response.json()
            console.log("general!")
            console.log(parseRes)
            setGeneralRankings(parseRes)
        } catch (err) {
            console.log(err.message)
        }
    }

      function handleOnDragStart() {
        console.log("drag start")
      }

      function handleOnDragUpdate() {
        console.log("drag update")
      }

      function handleOnDragEnd(result) {
        console.log("drag end")
        const { destination, source, draggableId } = result

        if (!destination) {
            console.log("ret 1")
            return
        }
        // cannot move in same exact spot
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            console.log("ret 2")
            return
        }
        // cannot move from unranked to unranked
        if (destination.droppableId === "column-2" && source.droppableId === "column-2") {
            console.log("ret 3")
            return
        }

        //cannot move from ranked to unranked (to make it easier for now)
        if (destination.droppableId === "column-2" && source.droppableId === "column-1") {
            console.log("ret 4")
            return
        }


        const start = state.columns[source.droppableId]
        const finish = state.columns[destination.droppableId]

        if (start === finish) {
            const newPlayerIds = Array.from(start.playerIds)
            newPlayerIds.splice(source.index, 1)
            newPlayerIds.splice(destination.index, 0, draggableId)

            const newColumn = {
                ...start,
                playerIds: newPlayerIds
            }

            const newState = {
                ...state, 
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn
                }
            }

            // make the post request to update the individual_rankings table (or make a button that recalculates at the end)

            setState(newState)
            return
        }

        // moving from one list to another
        const startPlayerIds = Array.from(start.playerIds)
        startPlayerIds.splice(source.index, 1)
        const newStart = {
            ...start,
            playerIds: startPlayerIds
        }

        const finishPlayerIds = Array.from(finish.playerIds)
        finishPlayerIds.splice(destination.index, 0, draggableId)
        const newFinish = {
            ...finish,
            playerIds: finishPlayerIds
        }

        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }
        // make the post request to update the individual_rankings table
        setState(newState)

      }

    useEffect(() => {
        getProfile();
        getInitialData();
        getGeneralRankings();
    }, []);

    return (
        <>
            <h1>Rankings!</h1>
            {profile !== null && state !== null && ( // Check if profile is not null
                    <div>
                        <h2>Rankings. you made it here</h2>
                        
                        <DragDropContext onDragStart={handleOnDragStart} onDragUpdate={handleOnDragUpdate} onDragEnd={handleOnDragEnd}>
                            <div id="ranking-container">
                                {/* <Column key={} column={col1} players={rankedProfiles}/>
                                <Column key={} column={col2} players={notRankedProfiles}/> */}
                                {state.columnOrder.map(columnId => {
                                    const column = state.columns[columnId];
                                    const playersInColumn = column.playerIds.map(playerId => state.players[playerId]);

                                    return <Column key={column.id} column={column} players={playersInColumn} />;
                                })}
                            </div>
                        </DragDropContext>
                        <button onClick={() => finalizeRankings()}>Finalize Rankings</button>
                        <h2>General Rankings</h2>
                        <div id="general_rankings">
                            {generalRankings && generalRankings.map((elem, index) => (
                                <GeneralRankingCard elem={elem} key={index} index={index} />
                            ))}
                        </div>

                    </div>
                
            )}
        </>
    );
};

export default Rankings;