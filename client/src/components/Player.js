import React from 'react';
import styled from 'styled-components';
import { Draggable } from "react-beautiful-dnd"

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
`;

const Player = ({ player, index }) => 
    <Draggable draggableId={player.id} index={index}>
        {(provided, snapshot)=> (
            <Container ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isDragging={snapshot.isDragging}>
                {player.content}
            </Container>
        )}
    </Draggable>

export default Player;