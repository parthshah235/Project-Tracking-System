export class Task {
    taskId?: string;
    taskName: string;
    taskDesc: string;
    taskDueDate: string;
    taskPriority: string;
    taskAttachment?: string;
    taskMembers?: string;
    taskStatus: number;
    assignedBy?:string
}