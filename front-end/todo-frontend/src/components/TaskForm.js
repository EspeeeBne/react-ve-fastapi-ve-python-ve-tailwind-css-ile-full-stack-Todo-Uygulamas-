import React, { useState } from 'react';

const TaskForm = ({ axiosInstance }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/tasks/', {
        title,
        due_date: dueDate,
        completion_date: completionDate,
      });
      setTitle('');
      setDueDate('');
      setCompletionDate('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form p-4 bg-white rounded-md shadow-md">
                      <label htmlFor="title"  className="block text-gray-700 font-bold mb-2">
          Görevin Adı:
        </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Görevin adı"
        className="task-input p-2 border border-gray-300 rounded w-full mb-2"
        required
      />
              <label htmlFor="dueDate"  className="block text-gray-700 font-bold mb-2">
          Başlama Tarihi:
        </label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Bitiş Tarihi"
        className="task-input p-2 border border-gray-300 rounded w-full mb-2"
      />
              <label htmlFor="completionDate" className="block text-gray-700 font-bold mb-2">
          Teslim Tarihi:
        </label>
      <input
        type="date"
        value={completionDate}
        onChange={(e) => setCompletionDate(e.target.value)}
        placeholder="Tamamlama Tarihi"
        className="task-input p-2 border border-gray-300 rounded w-full mb-2"
      />
      <button type="submit" className="task-button bg-blue-500 text-white px-4 py-2 rounded">
        Görev Ekle
      </button>
    </form>
  );
};

export default TaskForm;
