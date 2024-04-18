import React, { useEffect, useState } from "react";
import initialData from "./initialData";
import Column from './Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import "./Rankings.css";


const Rankings = ({ setAuth }) => {
    const [profile, setProfile] = useState(null);

    // const { columnOrder, columns, players } = initialData;

    const [state, setState] = useState(initialData)


    async function getProfile() {
        try {
            const response = await fetch("http://localhost:4000/rankings/", {
                method: "GET",
                headers: { token: localStorage.token }
            })

            const parseRes = await response.json()
            console.log(parseRes)
            setProfile(parseRes)
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
        const { destination, source, draggableId } = result

        if (!destination) {
            return
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
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
        setState(newState)

      }

    useEffect(() => {
        console.log("starting")
        getProfile();
    }, []);

    return (
        <>
            <h1>Rankings!</h1>
            {profile !== null && ( // Check if profile is not null
                    <div>
                        <h2>Rankings. you made it here</h2>
                        
                        <DragDropContext onDragStart={handleOnDragStart} onDragUpdate={handleOnDragUpdate} onDragEnd={handleOnDragEnd}>
                            <div id="ranking-container">
                                {state.columnOrder.map(columnId => {
                                    const column = state.columns[columnId];
                                    const playersInColumn = column.playerIds.map(playerId => state.players[playerId]);

                                    return <Column key={column.id} column={column} players={playersInColumn} />;
                                })}
                            </div>
                        </DragDropContext>

                    </div>
                
            )}
        </>
    );
};

export default Rankings;