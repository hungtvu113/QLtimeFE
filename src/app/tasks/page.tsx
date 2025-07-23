'use client';

import { Layout } from '@/components/layout/layout';
import { TaskList } from '@/components/task/task-list';
import ProjectSelector from '@/components/project/ProjectSelector';
import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { Project } from '@/lib/types';
import { TaskService } from '@/lib/services/task-service';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks từ API hoặc localStorage
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Kiểm tra xem có token không (chỉ trên client)
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (token) {
        // Nếu có token, thử tải từ API
        try {
          console.log('TasksPage: Đang tải tasks từ API...');
          const tasksData = await TaskService.getTasks();
          console.log('TasksPage: Đã tải tasks từ API:', tasksData);
          setTasks(tasksData);
          return;
        } catch (apiError: any) {
          console.warn('TasksPage: API lỗi, fallback to localStorage:', apiError);
        }
      }

      // Fallback to localStorage (cho guest users hoặc khi API lỗi)
      console.log('TasksPage: Đang tải tasks từ localStorage...');
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('tasks');
        if (stored) {
          const localTasks = JSON.parse(stored);
          console.log('TasksPage: Đã tải tasks từ localStorage:', localTasks);
          setTasks(localTasks);
        } else {
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    } catch (err: any) {
      console.error('TasksPage: Lỗi tải tasks:', err);
      setError(err.message || 'Không thể tải danh sách công việc');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          isLoading={isLoading}
          error={error}
          onRefresh={loadTasks}
        />
      </div>
    </Layout>
  );
}