import { Task, CreateTaskRequest } from './types/index';
export declare class TaskManager {
    private tasks;
    private nextId;
    constructor();
    private addSampleTasks;
    createTask(request: CreateTaskRequest): Task;
    getTasks(filter?: {
        status?: Task['status'];
        priority?: Task['priority'];
    }): Task[];
    updateTaskStatus(taskId: string, status: Task['status']): Task | null;
    deleteTask(taskId: string): boolean;
    getTaskStats(): {
        total: number;
        todo: number;
        inProgress: number;
        completed: number;
        overdue: number;
    };
}
//# sourceMappingURL=task-manager.d.ts.map