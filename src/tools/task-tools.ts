import { z } from 'zod';
import { TaskManager } from '../task-manager';

// Input schemas for validation
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const listTasksSchema = z.object({
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional()
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  status: z.enum(['todo', 'in-progress', 'completed'])
});

export const deleteTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required')
});

export function createTaskTools(taskManager: TaskManager) {
  return {
    create_task: {
      name: 'create_task',
      description: 'Create a new task with title, description, priority, and optional due date',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Task title' },
          description: { type: 'string', description: 'Task description' },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high'],
            description: 'Task priority level'
          },
          dueDate: { 
            type: 'string', 
            description: 'Due date in ISO format (YYYY-MM-DD)'
          },
          tags: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Tags for task categorization'
          }
        },
        required: ['title', 'description']
      },
      handler: async (args: any) => {
        try {
          const validated = createTaskSchema.parse(args);
          const task = taskManager.createTask(validated);
          
          return {
            content: [
              {
                type: 'text',
                text: `✅ Created task "${task.title}" (ID: ${task.id})\n` +
                      `Priority: ${task.priority}\n` +
                      `Due: ${task.dueDate ? task.dueDate.toLocaleDateString() : 'No due date'}\n` +
                      `Tags: ${task.tags.join(', ') || 'None'}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error creating task: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    },

    list_tasks: {
      name: 'list_tasks',
      description: 'List tasks with optional filtering by status and priority',
      inputSchema: {
        type: 'object',
        properties: {
          status: { 
            type: 'string', 
            enum: ['todo', 'in-progress', 'completed'],
            description: 'Filter by task status'
          },
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high'],
            description: 'Filter by task priority'
          }
        }
      },
      handler: async (args: any) => {
        try {
          const validated = listTasksSchema.parse(args);
          const tasks = taskManager.getTasks(validated);
          
          if (tasks.length === 0) {
            return {
              content: [
                {
                  type: 'text',
                  text: '📋 No tasks found matching your criteria.'
                }
              ]
            };
          }

          const taskList = tasks.map(task => {
            const statusEmoji = {
              'todo': '📝',
              'in-progress': '🔄',
              'completed': '✅'
            }[task.status];
            
            const priorityEmoji = {
              'high': '🔴',
              'medium': '🟡',
              'low': '🟢'
            }[task.priority];

            const dueInfo = task.dueDate 
              ? `Due: ${task.dueDate.toLocaleDateString()}`
              : 'No due date';
            
            const tagsInfo = task.tags.length > 0 
              ? `[${task.tags.join(', ')}]`
              : '';

            return `${statusEmoji} ${priorityEmoji} ${task.title} (${task.id})\n` +
                   `   ${task.description}\n` +
                   `   ${dueInfo} ${tagsInfo}`;
          }).join('\n\n');

          return {
            content: [
              {
                type: 'text',
                text: `📋 Found ${tasks.length} task(s):\n\n${taskList}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error listing tasks: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    },

    update_task_status: {
      name: 'update_task_status',
      description: 'Update the status of a specific task',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string', description: 'Task ID to update' },
          status: { 
            type: 'string', 
            enum: ['todo', 'in-progress', 'completed'],
            description: 'New task status'
          }
        },
        required: ['taskId', 'status']
      },
      handler: async (args: any) => {
        try {
          const validated = updateTaskStatusSchema.parse(args);
          const task = taskManager.updateTaskStatus(validated.taskId, validated.status);
          
          if (!task) {
            return {
              content: [
                {
                  type: 'text',
                  text: `❌ Task "${validated.taskId}" not found.`
                }
              ]
            };
          }

          const statusEmoji = {
            'todo': '📝',
            'in-progress': '🔄',
            'completed': '✅'
          }[validated.status];

          return {
            content: [
              {
                type: 'text',
                text: `${statusEmoji} Updated "${task.title}" to ${validated.status.replace('-', ' ')}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error updating task: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    },

    get_task_stats: {
      name: 'get_task_stats',
      description: 'Get comprehensive statistics about all tasks',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        try {
          const stats = taskManager.getTaskStats();
          
          return {
            content: [
              {
                type: 'text',
                text: `📊 Task Statistics:\n\n` +
                      `📋 Total Tasks: ${stats.total}\n` +
                      `📝 Todo: ${stats.todo}\n` +
                      `🔄 In Progress: ${stats.inProgress}\n` +
                      `✅ Completed: ${stats.completed}\n` +
                      `⏰ Overdue: ${stats.overdue}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `❌ Error getting statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    }
  };
}