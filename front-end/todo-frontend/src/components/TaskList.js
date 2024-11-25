import React, { useEffect, useState, useCallback } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const TaskList = ({ axiosInstance }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDeleteTask = async (task_id) => {
    try {
      await axiosInstance.delete(`/tasks/${task_id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== task_id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateDueDate = async (task_id, newDueDate) => {
    try {
      await axiosInstance.put(`/tasks/${task_id}`, { due_date: newDueDate });
      fetchTasks();
    } catch (error) {
      console.error('Error updating due date:', error);
    }
  };

  const handleToggleCompletion = async (task_id, completedStatus) => {
    try {
      await axiosInstance.put(`/tasks/${task_id}`, { completed: completedStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 500);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  return (
    <div className="task-list p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="task-title text-lg font-bold mb-4">Görevler</h2>
      <ul className="task-items list-disc pl-5">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="task-item p-2 border-b border-gray-300">
              <div className="task-details mb-2">
                <span className="task-title font-bold">{task.title}</span>
                <span className="task-status ml-2 text-sm">- {task.completed ? 'Tamamlandı' : 'Devam Ediyor'}</span>
              </div>
              <div className="task-meta text-sm text-gray-500">
                <p>Oluşturulma Tarihi: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Tarih Yok'}</p>
                <p>Bitirme Durumu: {task.completed ? 'Tamamlandı' : (task.due_date ? `Bitişine ${formatDistanceToNow(parseISO(task.due_date))} kaldı` : 'Bitiş tarihi yok')}</p>
              </div>
              <label htmlFor="completionDate" className="block text-gray-700 font-bold mb-2">
          Teslim Tarihini Değiştir
        </label>
              <input
                type="date"
                value={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''}
                onChange={(e) => handleUpdateDueDate(task.id, e.target.value)}
                className="due-date-input p-2 border border-gray-300 rounded w-full mb-2"
              />
              <div className="task-actions flex gap-2">
                <button
                  onClick={() => handleToggleCompletion(task.id, !task.completed)}
                  className={`toggle-completion-button mt-2 px-4 py-2 ${task.completed ? 'bg-green-500' : 'bg-yellow-500'} text-white rounded`}
                >
                  {task.completed ? 'Tamamlanmadı Olarak İşaretle' : 'Tamamlandı Olarak İşaretle'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="delete-button mt-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Görevi Sil
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="task-item p-2">Henüz görev yok.</li>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
