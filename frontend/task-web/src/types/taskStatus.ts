export const TaskStatus = {
    All: 'all',
    Completed: 'completed',
    Pending: 'pending'
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];