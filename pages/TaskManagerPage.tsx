
import React, { useState, useMemo } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useTaskManager } from '../hooks/useTaskManager';
import TaskItem from '../components/TaskItem';
import ConfirmationModal from '../components/ConfirmationModal';
import { GoogleGenAI } from "@google/genai";
import { WandIcon } from '../components/Icons';
import Loader from '../components/Loader';

const TaskManagerPage: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTaskDueDate } = useTaskManager();
  const [newTaskText, setNewTaskText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  // State for AI summary
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTaskText, newDueDate || null);
    setNewTaskText('');
    setNewDueDate('');
  };
  
  const pendingTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.completed), [tasks]);

  const openDeleteConfirmation = (id: number) => {
    setTaskToDelete(id);
  };

  const closeDeleteConfirmation = () => {
    setTaskToDelete(null);
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      deleteTask(taskToDelete);
      closeDeleteConfirmation();
    }
  };

  const handleSummarizeTasks = async () => {
    if (tasks.length === 0) return;

    setIsSummarizing(true);
    setSummary(null);
    setSummaryError(null);

    // FIX: Use process.env.API_KEY per coding guidelines.
    if (!process.env.API_KEY) {
        setSummaryError("AI features are disabled. Please set the API_KEY environment variable in your hosting provider's settings and redeploy the application to enable this tool.");
        setIsSummarizing(false);
        return;
    }

    try {
        const pendingList = pendingTasks.map(t => `- ${t.text}${t.dueDate ? ` (Due: ${new Date(t.dueDate).toLocaleDateString()})` : ''}`).join('\n');
        const completedList = completedTasks.map(t => `- ${t.text}`).join('\n');

        const prompt = `
        Analyze my current task list and provide a brief, actionable summary.
        - Start with a one-sentence overview of my current workload.
        - Highlight any urgent or upcoming tasks based on due dates.
        - Comment on the balance between pending and completed work.
        - Conclude with a motivational or strategic suggestion.
        
        My Task List:
        
        Pending Tasks:
        ${pendingList || 'No pending tasks.'}
        
        Completed Tasks:
        ${completedList || 'No completed tasks yet.'}
        `;

        // FIX: Use process.env.API_KEY per coding guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setSummary(response.text);

    } catch (e) {
        console.error(e);
        setSummaryError('Failed to generate summary. The AI service may be temporarily unavailable.');
    } finally {
        setIsSummarizing(false);
    }
  };

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
            className="flex-grow w-full px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 focus:ring-2 focus:ring-primary transition-colors shadow-sm dark:shadow-none"
            aria-label="New task input"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-700 border-transparent dark:border-slate-600 focus:ring-2 focus:ring-primary transition-colors shadow-sm dark:shadow-none"
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

        {isSummarizing && <Loader message="AI is summarizing your tasks..." />}
        {summaryError && <p className="text-red-500 text-center font-semibold">{summaryError}</p>}
        {summary && (
            <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg relative animate-fade-in">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <WandIcon className="w-5 h-5" />
                    AI Summary
                </h4>
                <p className="whitespace-pre-wrap text-primary/90">{summary}</p>
                <button 
                    onClick={() => setSummary(null)} 
                    className="absolute top-2 right-2 text-primary/70 hover:text-primary font-bold text-2xl leading-none px-2 rounded-full"
                    aria-label="Close summary"
                >
                    &times;
                </button>
            </div>
        )}

        <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 flex-wrap gap-2">
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                    To Do ({pendingTasks.length})
                </h3>
                <button
                    onClick={handleSummarizeTasks}
                    disabled={tasks.length === 0 || isSummarizing}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-primary bg-white dark:bg-slate-800 border-2 border-primary/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-none"
                >
                    <WandIcon className="w-4 h-4" />
                    Summarize with AI
                </button>
            </div>
            {pendingTasks.length > 0 ? (
                <ul className="space-y-3">
                    {pendingTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={openDeleteConfirmation} onUpdateDueDate={updateTaskDueDate} />
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">Nothing to do. Add a task to get started!</p>
            )}
        </div>

        {completedTasks.length > 0 && (
             <div className="space-y-4">
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                    Completed ({completedTasks.length})
                </h3>
                <ul className="space-y-3">
                    {completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={openDeleteConfirmation} onUpdateDueDate={updateTaskDueDate} />
                    ))}
                </ul>
            </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
      />
    </ToolPageLayout>
  );
};

export default TaskManagerPage;