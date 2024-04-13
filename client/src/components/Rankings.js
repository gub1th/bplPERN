import React, { useEffect, useState } from "react";
import initialData from "./initialData";
import Column from './Column';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


const Rankings = ({ setAuth }) => {
    const [profile, setProfile] = useState(null);
    const [optIn, setOptIn] = useState(false); // State for managing opt-in status

    const { columnOrder, columns, tasks } = initialData;


    async function getProfile() {
        try {
            const response = await fetch("http://localhost:4000/rankings/", {
                method: "GET",
                headers: { token: localStorage.token }
            })

            const parseRes = await response.json()
            console.log(parseRes)
            setProfile(parseRes)
            setOptIn(parseRes.opt_in)
        } catch (err) {
            console.log(err.message)
        }
    }

    async function updateOptInStatus(newOptIn) {
        try {
          const response = await fetch("http://localhost:4000/rankings/optin/", {
            method: "POST",
            headers: {
              token: localStorage.token,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ opt_in: newOptIn })
          });
      
          const parseRes = await response.json();
          console.log(parseRes)
          if (parseRes.success) {
            setProfile(currentProfile => ({ ...currentProfile, opt_in: newOptIn }));
            setOptIn(newOptIn);
          }
        } catch (err) {
            console.log("shet")
            console.log(err.message);
        }
      }
      
      const handleOptInChange = () => {
        console.log("handleOptInChange")
        console.log(optIn)
        const newOptInStatus = !optIn;
        console.log(newOptInStatus)
        updateOptInStatus(newOptInStatus);
      };

      function handleOnDragEnd(result) {
      }

    useEffect(() => {
        console.log("starting")
        getProfile();
    }, [optIn]);

    return (
        <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div>
                    {columnOrder.map(columnId => {
                        const column = columns[columnId];
                        const tasksInColumn = column.taskIds.map(taskId => tasks[taskId]);

                        return <Column key={column.id} column={column} tasks={tasksInColumn} />;
                    })}
                </div>
            </DragDropContext>
            {/* <h1>Rankings!</h1>
            <button onClick={() => console.log(optIn)}>state opt in</button>
            <button onClick={()=>console.log(profile?.opt_in)}>profile opt in</button>
            {profile !== null && ( // Check if profile is not null
                profile.opt_in ? (
                    // If user has opted in, show the rankings
                    <div>
                        <h2>Rankings. you made it here</h2>
                        <button onClick={handleOptInChange}>{profile.opt_in ? "Opt Out" : "Opt In"}</button>
                    </div>
                ) : (
                    // If user has not opted in, show message and option to opt-in
                    <div>
                        <p>You must opt in to see the rankings.</p>
                        <button onClick={handleOptInChange}>{profile.opt_in ? "Opt Out" : "Opt In"}</button>
                    </div>
                )
            )} */}
        </>
    );
};

export default Rankings;