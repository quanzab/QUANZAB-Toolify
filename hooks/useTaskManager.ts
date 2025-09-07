import { useState, useEffect } from 'react';
import { Task } from '../types';

const LOCAL_STORAGE_KEY = 'quanzab-tasks';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Error reading tasks from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage", error);
    }
  }, [tasks]);

  const addTask = (text: string, dueDate: string | null) => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
      dueDate,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const updateTaskDueDate = (id: number, dueDate: string | null) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, dueDate } : task
      )
    );
  };

  return { tasks, addTask, toggleTask, deleteTask, updateTaskDueDate };
};
