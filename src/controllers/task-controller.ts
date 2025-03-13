import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import chalk from 'chalk'
import { Command } from 'commander'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const FILE_PATH = path.join(__dirname, '../../tasks.json')

interface Task {
  id: string
  description: string
  status: 'pending' | 'in progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  dueDate?: string
}

const ensureFileExists = async (): Promise<void> => {
  try {
    await fs.access(FILE_PATH)
  } catch {
    await fs.writeFile(FILE_PATH, JSON.stringify([], null, 2))
    return
  }
}

export const loadTask = async (): Promise<Task[]> => {
  await ensureFileExists()
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8')
    return JSON.parse(data) as Task[]
  } catch (error) {
    console.log(chalk.red('Error to load tasks...'), error)
    return []
  }
}

export const saveTask = async (tasks: Task[]): Promise<void> => {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(tasks, null, 2))
  } catch (error) {
    console.log(chalk.red('Error to save tasks...'), error)
  }
}

export const addTask = async (
  description: string,
  priority: Task['priority'],
  dueDate?: string
): Promise<void> => {
  if (!description) {
    console.log(chalk.red('Error: Description is mandatory'))
    return
  }

  const tasks = await loadTask()
  const newTask: Task = {
    id: uuidv4(),
    description,
    status: 'pending',
    priority,
    createdAt: new Date().toISOString(),
    dueDate: dueDate || undefined,
  }

  tasks.push(newTask)
  await saveTask(tasks)
  console.log(chalk.green(`Task add: "${description}"`))
}

export const updateTask = async (
  id: string,
  status: Task['status']
): Promise<void> => {
  const validStatus: Task['status'][] = ['pending', 'in progress', 'completed']

  if (!validStatus.includes(status)) {
    console.log(
      chalk.red('Invalid status. Use "pending", "in progress", "completed"')
    )
    return
  }

  const tasks = await loadTask()
  const task = tasks.find((t) => t.id === id)

  if (!task) {
    console.log(chalk.red('Error: Task not found...'))
    return
  }

  task.status = status
  await saveTask(tasks)
  console.log(chalk.blue(`Task ${id} in now ${status}`))
}

export const removeTask = async (id: string): Promise<void> => {
  const tasks = await loadTask()
  const newTasks = tasks.filter((t) => t.id !== id)

  if (tasks.length === newTasks.length) {
    console.log(chalk.red('Error: Task not found...'))
    return
  }

  await saveTask(newTasks)
  console.log(chalk.yellow(`Task ${id} removed`))
}

export const listTask = async (filter?: Task['status']): Promise<void> => {
  const tasks = await loadTask()
  let filteredTasks = tasks

  if (filter) {
    filteredTasks = tasks.filter((t) => t.status === filter)
  }

  filteredTasks.sort((a, b) => {
    const priorityOrder = { low: 3, medium: 2, high: 1 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  if (filteredTasks.length === 0) {
    console.log(chalk.gray('No tasks found!'))
    return
  }

  console.log(chalk.magenta('\nTask List:'))
  filteredTasks.forEach((t) => {
    const statusColor =
      t.status === 'completed'
        ? chalk.green
        : t.status === 'in progress'
        ? chalk.yellow
        : chalk.red

    console.log(
      `${chalk.cyan(`[${t.id}]`)} ${t.description} - ${statusColor(
        t.status
      )} ${chalk.blue(t.priority)}`
    )
  })
}

export const exportTasks = async (): Promise<void> => {
  const tasks = await loadTask()
  const content = tasks
    .map(
      (task) =>
        `[${task.id}] ${task.description} - ${task.status} ${task.priority}`
    )
    .join('\n')

  await fs.writeFile('tasks_report.txt', content)
  console.log('Report saved as tasks_report.txt')
}

export const searchTask = async (title: string): Promise<void> => {
  const tasks = await loadTask()
  const results = tasks.filter((task) =>
    task.description.toLowerCase().includes(title.toLowerCase())
  )

  if (results.length === 0) {
    console.log(chalk.red('Task not found...'))
  } else {
    console.log(chalk.blue('\n Search result: '))
    results.forEach((task) => {
      console.log(`[${task.id}] ${task.description} - ${task.status}`)
    })
  }
}
