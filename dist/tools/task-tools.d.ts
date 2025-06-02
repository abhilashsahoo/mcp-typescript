import { z } from 'zod';
import { TaskManager } from '../task-manager.js';
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
    dueDate: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    priority?: "low" | "medium" | "high" | undefined;
    dueDate?: string | undefined;
    tags?: string[] | undefined;
}, {
    title: string;
    description: string;
    priority?: "low" | "medium" | "high" | undefined;
    dueDate?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const listTasksSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["todo", "in-progress", "completed"]>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "todo" | "in-progress" | "completed" | undefined;
    priority?: "low" | "medium" | "high" | undefined;
}, {
    status?: "todo" | "in-progress" | "completed" | undefined;
    priority?: "low" | "medium" | "high" | undefined;
}>;
export declare const updateTaskStatusSchema: z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<["todo", "in-progress", "completed"]>;
}, "strip", z.ZodTypeAny, {
    status: "todo" | "in-progress" | "completed";
    taskId: string;
}, {
    status: "todo" | "in-progress" | "completed";
    taskId: string;
}>;
export declare const deleteTaskSchema: z.ZodObject<{
    taskId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    taskId: string;
}, {
    taskId: string;
}>;
export declare function createTaskTools(taskManager: TaskManager): {
    create_task: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                title: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                priority: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                dueDate: {
                    type: string;
                    description: string;
                };
                tags: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
            };
            required: string[];
        };
        handler: (args: any) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
    list_tasks: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                status: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                priority: {
                    type: string;
                    enum: string[];
                    description: string;
                };
            };
        };
        handler: (args: any) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
    update_task_status: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                taskId: {
                    type: string;
                    description: string;
                };
                status: {
                    type: string;
                    enum: string[];
                    description: string;
                };
            };
            required: string[];
        };
        handler: (args: any) => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
    get_task_stats: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {};
        };
        handler: () => Promise<{
            content: {
                type: string;
                text: string;
            }[];
        }>;
    };
};
//# sourceMappingURL=task-tools.d.ts.map