import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <li className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 transition-colors duration-300 hover:bg-slate-700/50">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-5 w-5 rounded bg-slate-700 border-slate-600 text-primary focus:ring-primary"
        />
        <span className={`font-medium text-gray-300 transition-all ${task.completed ? 'line-through text-slate-500' : ''}`}>
          {task.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="p-1 text-red-500 hover:text-red-400 rounded-full hover:bg-red-900/50 transition-colors"
        aria-label={`Delete task: ${task.text}`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </li>
  );
};

export default TaskItem;
