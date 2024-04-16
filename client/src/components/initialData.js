const initialData = {
    players : {
        'player-1': {id: 'player-1', content: 'daniel'},
        'player-2': {id: 'player-2', content: 'jp'},
        'player-3': {id: 'player-3', content: 'munoz'},
        'player-4': {id: 'player-4', content: 'edwin'},
        'player-5': {id: 'player-5', content: 'dh'},
    },
    columns : {
        'column-1': {
            id: 'column-1',
            title: 'Custom List',
            playerIds: ['player-1', 'player-2', 'player-3', 'player-4']
        },
        'column-2': {
            id: 'column-2',
            title: 'To Be Ranked',
            playerIds: []
        },
    },
    // facilitate ordering of columns
    columnOrder: ['column-1', 'column-2'],
}

export default initialData;