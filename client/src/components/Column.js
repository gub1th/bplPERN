import React from 'react';
import styled from 'styled-components';
import Player from './Player'; // Rename the file to match the component name
import { Droppable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "./StrictModeDroppable";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 250px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const PlayerList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
  flex-grow: 1;
  min-height: 200px;
`;

const Column = ({ column, players }) => (
  <Container>
    <Title>{column.title}</Title>
    <StrictModeDroppable droppableId={column.id}>
        {(provided, snapshot) => (
            <PlayerList ref={provided.innerRef} {...provided.droppableProps} isDraggingOver={snapshot.isDraggingOver}>
                {players.map((player, index) => <Player key={player.profile_id} player={player} index={index}/>)}
                {provided.placeholder}
            </PlayerList>
        )}
    </StrictModeDroppable>
  </Container>
);

export default Column;