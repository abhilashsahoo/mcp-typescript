"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskSchema = exports.updateTaskStatusSchema = exports.listTasksSchema = exports.createTaskSchema = void 0;
exports.createTaskTools = createTaskTools;
const zod_1 = require("zod");
// Input schemas for validation
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional(),
    dueDate: zod_1.z.string().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional()
});
exports.listTasksSchema = zod_1.z.object({
    status: zod_1.z.enum(['todo', 'in-progress', 'completed']).optional(),
    priority: zod_1.z.enum(['low', 'medium', 'high']).optional()
});
exports.updateTaskStatusSchema = zod_1.z.object({
    taskId: zod_1.z.string().min(1, 'Task ID is required'),
    status: zod_1.z.enum(['todo', 'in-progress', 'completed'])
});
exports.deleteTaskSchema = zod_1.z.object({
    taskId: zod_1.z.string().min(1, 'Task ID is required')
});
function createTaskTools(taskManager) {
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
            handler: async (args) => {
                try {
                    const validated = exports.createTaskSchema.parse(args);
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
                }
                catch (error) {
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
            handler: async (args) => {
                try {
                    const validated = exports.listTasksSchema.parse(args);
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
                }
                catch (error) {
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
            handler: async (args) => {
                try {
                    const validated = exports.updateTaskStatusSchema.parse(args);
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
                }
                catch (error) {
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
                }
                catch (error) {
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
//# sourceMappingURL=task-tools.js.map