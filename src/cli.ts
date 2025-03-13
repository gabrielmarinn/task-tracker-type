import inquirer from 'inquirer'
import {
  addTask,
  listTask,
  updateTask,
  removeTask,
  exportTasks,
  searchTask,
} from './controllers/task-controller.js'

const menu = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        'Add task',
        'List task',
        'Update task',
        'Remove task',
        'Search Task',
        'Export tasks',
        'Exit',
      ],
    },
  ])

  if (action === 'Add task') {
    const { title, priority, dueDate } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'description',
      },

      {
        type: 'list',
        name: 'priority',
        message: 'Task priority',
        choices: ['low', 'medium', 'high'],
      },

      {
        type: 'input',
        name: 'dueDate',
        message: 'Due date (YYYY-MM-DD, optional): ',
        default: '',
      },
    ])
    await addTask(title, priority, dueDate || undefined)
  }

  if (action === 'List task') {
    const { filter } = await inquirer.prompt([
      {
        type: 'list',
        name: 'filter',
        message: 'Filter tasks by Status',
        choices: ['all', 'pending', 'in progress', 'completed'],
      },
    ])
    await listTask(filter === 'all' ? undefined : filter)
  }

  if (action === 'Update task') {
    const { id, status } = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Task id',
      },

      {
        type: 'list',
        name: 'status',
        message: 'new status',
        choices: ['pending', 'in progress', 'completed'],
      },
    ])
    await updateTask(id, status)
  }

  if (action === 'Remove task') {
    const { id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Task ID to remove',
      },
    ])
    await removeTask(id)
  }

  if (action === 'Search task') {
    const { title } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter task title to search: ',
      },
    ])
    await searchTask(title)
  }

  if (action === 'Export task') {
    await exportTasks()
  }

  if (action !== 'Exit') {
    menu()
  }
}

export default menu
