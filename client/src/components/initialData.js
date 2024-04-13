const initialData = {
    tasks : {
        'task-1': {id: 'task-1', content: 'take out apple'},
        'task-2': {id: 'task-2', content: 'take out orange'},
        'task-3': {id: 'task-3', content: 'take out banana'},
        'task-4': {id: 'task-4', content: 'take out pear'},
    },
    columns : {
        'column-1': {
            id: 'column-1',
            title: 'To Do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
        }
    },
    // facilitate ordering of columns
    columnOrder: ['column-1'],
}

export default initialData;