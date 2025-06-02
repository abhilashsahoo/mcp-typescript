import { Task, CreateTaskRequest } from './types/index';

export class TaskManager {
  private tasks: Map<string, Task> = new Map();
  private nextId = 1;

  constructor() {
    // Add some sample data
    this.addSampleTasks();
  }

  private addSampleTasks() {
    const sampleTasks = [
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        priority: 'high' as const,
        tags: ['devops', 'automation']
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST endpoints with examples',
        priority: 'medium' as const,
        tags: ['docs', 'api']
      }
    ];

    sampleTasks.forEach(task => this.createTask(task));
  }

  createTask(request: CreateTaskRequest): Task {
    const task: Task = {
      id: `task-${this.nextId++}`,
      title: request.title,
      description: request.description,
      status: 'todo',
      priority: request.priority || 'medium',
      createdAt: new Date(),
      dueDate: request.dueDate ? new Date(request.dueDate) : undefined,
      tags: request.tags || []
    };

    this.tasks.set(task.id, task);
    return task;
  }

  getTasks(filter?: { status?: Task['status']; priority?: Task['priority'] }): Task[] {
    let tasks = Array.from(this.tasks.values());

    if (filter?.status) {
      tasks = tasks.filter(task => task.status === filter.status);
    }

    if (filter?.priority) {
      tasks = tasks.filter(task => task.priority === filter.priority);
    }

    // Sort by priority (high to low), then by creation date
    return tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }

  updateTaskStatus(taskId: string, status: Task['status']): Task | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    task.status = status;
    return task;
  }

  deleteTask(taskId: string): boolean {
    return this.tasks.delete(taskId);
  }

  getTaskStats() {
    const tasks = Array.from(this.tasks.values());
    const now = new Date();
    
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => 
        t.dueDate && t.dueDate < now && t.status !== 'completed'
      ).length
    };
  }
}