
import React, { useState, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';

interface Task {
  id: number;
  content: string;
}

type ColumnId = 'todo' | 'inProgress' | 'done';

interface Columns {
  todo: { name: 'To Do'; items: Task[] };
  inProgress: { name: 'In Progress'; items: Task[] };
  done: { name: 'Done'; items: Task[] };
}

const LOCAL_STORAGE_KEY = 'quanzab-project-planner';

const ProjectPlannerPage: React.FC = () => {
    const [columns, setColumns] = useState<Columns>(() => {
        try {
            const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : {
                todo: { name: 'To Do', items: [{ id: 1, content: 'Plan project structure' }] },
                inProgress: { name: 'In Progress', items: [] },
                done: { name: 'Done', items: [] },
            };
        } catch {
            return {
                todo: { name: 'To Do', items: [] },
                inProgress: { name: 'In Progress', items: [] },
                done: { name: 'Done', items: [] },
            };
        }
    });
    
    const [newTaskContent, setNewTaskContent] = useState('');

    useEffect(() => {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columns));
    }, [columns]);

    const handleAddTask = () => {
        if (!newTaskContent.trim()) return;
        const newId = Date.now();
        const newTask: Task = { id: newId, content: newTaskContent };
        setColumns(prev => ({
            ...prev,
            todo: { ...prev.todo, items: [...prev.todo.items, newTask] }
        }));
        setNewTaskContent('');
    };

    const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number, sourceColId: ColumnId) => {
        e.dataTransfer.setData('taskId', String(taskId));
        e.dataTransfer.setData('sourceColId', sourceColId);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>, destColId: ColumnId) => {
        const taskId = Number(e.dataTransfer.getData('taskId'));
        const sourceColId = e.dataTransfer.getData('sourceColId') as ColumnId;

        if (sourceColId === destColId) return;

        let taskToMove: Task | undefined;
        const sourceCol = { ...columns[sourceColId] };
        
        taskToMove = sourceCol.items.find(item => item.id === taskId);
        sourceCol.items = sourceCol.items.filter(item => item.id !== taskId);

        if (!taskToMove) return;

        const destCol = { ...columns[destColId] };
        destCol.items.push(taskToMove);

        setColumns({
            ...columns,
            [sourceColId]: sourceCol,
            [destColId]: destCol,
        });
    };
    
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <ToolPageLayout
            title="Project Planner"
            description="Organize projects with a drag-and-drop Kanban board. Data is saved in your browser."
        >
            <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add New Task</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        placeholder="Enter a new task..."
                        className="flex-grow p-2 border rounded-md bg-slate-100 dark:bg-slate-800 border-transparent dark:border-slate-600 shadow-sm dark:shadow-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={handleAddTask} className="px-4 py-2 font-semibold text-slate-900 bg-primary rounded-lg shadow-sm">Add Task</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.keys(columns) as ColumnId[]).map(colId => {
                    const column = columns[colId];
                    return (
                        <div
                            key={colId}
                            onDrop={(e) => onDrop(e, colId)}
                            onDragOver={onDragOver}
                            className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg border border-transparent dark:border-slate-700 shadow-md dark:shadow-none"
                        >
                            <h3 className="font-bold text-lg mb-4 text-center text-primary">{column.name} ({column.items.length})</h3>
                            <div className="space-y-3 min-h-[40vh]">
                                {column.items.map(task => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, task.id, colId)}
                                        className="p-3 bg-white dark:bg-slate-700 rounded-md shadow-md cursor-grab active:cursor-grabbing text-slate-800 dark:text-gray-200"
                                    >
                                        {task.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </ToolPageLayout>
    );
};

export default ProjectPlannerPage;