export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    dueDate?: Date;
    tags: string[];
}
export interface CreateTaskRequest {
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
}
export interface UpdateTaskRequest {
    taskId: string;
    status: 'todo' | 'in-progress' | 'completed';
}
//# sourceMappingURL=index.d.ts.map