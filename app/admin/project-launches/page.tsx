'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectLaunch {
  id: number;
  title: string;
  description: string;
  image_url: string;
  status: string;
  target_amount: number;
  raised_amount: number;
  participants_count: number;
  created_at: string;
}

export default function ProjectLaunchesPage() {
  const [projects, setProjects] = useState<ProjectLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectLaunch | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    status: 'active',
    target_amount: '',
    raised_amount: '',
    participants_count: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/project-launches');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      toast.error('Не удалось загрузить проекты');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProject 
        ? `/api/admin/project-launches?id=${editingProject.id}`
        : '/api/admin/project-launches';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          target_amount: parseFloat(formData.target_amount),
          raised_amount: parseFloat(formData.raised_amount || '0'),
          participants_count: parseInt(formData.participants_count || '0')
        })
      });

      if (response.ok) {
        toast.success(editingProject ? 'Проект обновлен' : 'Проект создан');
        setShowForm(false);
        setEditingProject(null);
        resetForm();
        fetchProjects();
      } else {
        toast.error('Ошибка сохранения проекта');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка сохранения проекта');
    }
  };

  const handleEdit = (project: ProjectLaunch) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      status: project.status,
      target_amount: project.target_amount.toString(),
      raised_amount: project.raised_amount.toString(),
      participants_count: project.participants_count.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;

    try {
      const response = await fetch(`/api/admin/project-launches?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Проект удален');
        fetchProjects();
      } else {
        toast.error('Ошибка удаления проекта');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка удаления проекта');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      status: 'active',
      target_amount: '',
      raised_amount: '',
      participants_count: ''
    });
  };

  const calculateProgress = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Запуски проектов</h1>
          <p className="text-gray-600 mt-1">Управление инвестиционными проектами</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingProject(null);
            resetForm();
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить проект
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingProject ? 'Редактировать проект' : 'Новый проект'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Название проекта *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активный</SelectItem>
                      <SelectItem value="completed">Завершен</SelectItem>
                      <SelectItem value="pending">В ожидании</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="target_amount">Целевая сумма *</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="raised_amount">Собрано</Label>
                  <Input
                    id="raised_amount"
                    type="number"
                    step="0.01"
                    value={formData.raised_amount}
                    onChange={(e) => setFormData({ ...formData, raised_amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="participants_count">Участников</Label>
                  <Input
                    id="participants_count"
                    type="number"
                    value={formData.participants_count}
                    onChange={(e) => setFormData({ ...formData, participants_count: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingProject ? 'Обновить' : 'Создать'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">Нет проектов. Создайте первый проект.</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="md:flex">
                {project.image_url && (
                  <div className="md:w-1/3">
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={project.image_url ? "md:w-2/3" : "w-full"}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription className="mt-2">{project.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Прогресс</span>
                          <span className="font-semibold">
                            {calculateProgress(project.raised_amount, project.target_amount)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${calculateProgress(project.raised_amount, project.target_amount)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Целевая сумма</p>
                          <p className="text-lg font-semibold">${project.target_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Собрано</p>
                          <p className="text-lg font-semibold text-green-600">
                            ${project.raised_amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Участников</p>
                          <p className="text-lg font-semibold">{project.participants_count}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status === 'active' ? 'Активный' :
                           project.status === 'completed' ? 'Завершен' : 'В ожидании'}
                        </span>
                        <span className="text-sm text-gray-500">
                          Создан: {new Date(project.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
