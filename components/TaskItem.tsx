
import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateDueDate: (id: number, dueDate: string | null) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdateDueDate }) => {
  const isOverdue = !task.completed && task.dueDate ? new Date(task.dueDate) < new Date() && new Date(task.dueDate).toDateString() !== new Date().toDateString() : false;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateDueDate(task.id, e.target.value || null);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Accounts for timezone offset to show the correct local date
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-transparent dark:border-slate-700 transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 gap-2 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-5 w-5 rounded bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-primary focus:ring-primary flex-shrink-0 mt-1 sm:mt-0"
        />
        <span className={`font-medium text-slate-800 dark:text-gray-300 transition-all break-words ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
          {task.text}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end pl-8 sm:pl-0">
        <div className="flex items-center gap-2 relative">
            <label className={`cursor-pointer text-xs font-semibold px-2 py-1 rounded-md ${isOverdue ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                {task.dueDate ? formatDate(task.dueDate) : 'Set Date'}
                <input 
                    type="date"
                    value={task.dueDate || ''}
                    onChange={handleDateChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </label>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-red-500 hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          aria-label={`Delete task: ${task.text}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
