import React, { useState, useMemo } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useTaskManager } from '../hooks/useTaskManager';
import TaskItem from '../components/TaskItem';

const TaskManagerPage: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTaskDueDate } = useTaskManager();
  const [newTaskText, setNewTaskText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTaskText, newDueDate || null);
    setNewTaskText('');
    setNewDueDate('');
  };
  
  const pendingTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.completed), [tasks]);

  return (
    <ToolPageLayout
      title="Task Manager"
      description="Keep track of your to-do list. Your tasks are saved locally in your browser."
    >
      <div className="space-y-6">
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:ring-2 focus:ring-primary transition-colors"
            aria-label="New task input"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="px-4 py-2 border border-slate-600 rounded-lg bg-slate-700 focus:ring-2 focus:ring-primary transition-colors"
            aria-label="New task due date"
          />
          <button
            type="submit"
            className="px-6 py-2 font-semibold text-slate-900 bg-primary rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600"
            disabled={!newTaskText.trim()}
          >
            Add
          </button>
        </form>

        <div className="space-y-4">
            <h3 className="text-xl font-bold font-heading text-white border-b border-slate-700 pb-2">
                To Do ({pendingTasks.length})
            </h3>
            {pendingTasks.length > 0 ? (
                <ul className="space-y-3">
                    {pendingTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onUpdateDueDate={updateTaskDueDate} />
                    ))}
                </ul>
            ) : (
                <p className="text-slate-400 text-center py-4">Nothing to do. Add a task to get started!</p>
            )}
        </div>

        {completedTasks.length > 0 && (
             <div className="space-y-4">
                <h3 className="text-xl font-bold font-heading text-white border-b border-slate-700 pb-2">
                    Completed ({completedTasks.length})
                </h3>
                <ul className="space-y-3">
                    {completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onUpdateDueDate={updateTaskDueDate} />
                    ))}
                </ul>
            </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default TaskManagerPage;
