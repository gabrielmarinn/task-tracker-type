import inquirer from 'inquirer'
import {
  addTask,
  listTask,
  updateTask,
  removeTask,
} from './controllers/task-controller.js'

const menu = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you to do?',
      choices: ['Add task', 'Task list', 'Update task', 'Remove task', 'Exit'],
    },
  ])

  if (action === 'Add task') {
    const { title } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'description',
      },
    ])
    await addTask(title)
  }

  if (action === 'Task list') {
    await listTask()
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
        message: 'Task id to remove',
      },
    ])
    await removeTask(id)
  }

  if (action !== 'Exit') {
    menu()
  }
}

export default menu
