"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Save } from "lucide-react"

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("team")
  
  // Team state
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [editingTeam, setEditingTeam] = useState<any>(null)
  
  // Careers state
  const [careers, setCareers] = useState<any[]>([])
  const [editingCareer, setEditingCareer] = useState<any>(null)
  
  // Pages state
  const [pages, setPages] = useState<any[]>([])
  const [editingPage, setEditingPage] = useState<any>(null)

  useEffect(() => {
    loadTeam()
    loadCareers()
    loadPages()
  }, [])

  const loadTeam = async () => {
    const res = await fetch('/api/admin/team')
    if (res.ok) {
      const data = await res.json()
      setTeamMembers(data.data || [])
    }
  }

  const loadCareers = async () => {
    const res = await fetch('/api/admin/careers')
    if (res.ok) {
      const data = await res.json()
      setCareers(data.data || [])
    }
  }

  const loadPages = async () => {
    const res = await fetch('/api/admin/pages')
    if (res.ok) {
      const data = await res.json()
      setPages(data.data || [])
    }
  }

  const saveTeamMember = async () => {
    const method = editingTeam.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/team', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTeam)
    })
    
    if (res.ok) {
      alert('Сохранено!')
      setEditingTeam(null)
      loadTeam()
    }
  }

  const deleteTeamMember = async (id: string) => {
    if (!confirm('Удалить члена команды?')) return
    
    const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      alert('Удалено!')
      loadTeam()
    }
  }

  const saveCareer = async () => {
    const method = editingCareer.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/careers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCareer)
    })
    
    if (res.ok) {
      alert('Сохранено!')
      setEditingCareer(null)
      loadCareers()
    }
  }

  const deleteCareer = async (id: string) => {
    if (!confirm('Удалить вакансию?')) return
    
    const res = await fetch(`/api/admin/careers?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      alert('Удалено!')
      loadCareers()
    }
  }

  const savePage = async () => {
    const method = editingPage.id ? 'PUT' : 'POST'
    const res = await fetch('/api/admin/pages', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPage)
    })
    
    if (res.ok) {
      alert('Сохранено!')
      setEditingPage(null)
      loadPages()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-white mb-8">Управление контентом</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800 mb-8">
            <TabsTrigger value="team">Команда</TabsTrigger>
            <TabsTrigger value="careers">Вакансии</TabsTrigger>
            <TabsTrigger value="pages">Страницы</TabsTrigger>
          </TabsList>

          {/* TEAM TAB */}
          <TabsContent value="team">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Члены команды</h2>
                  <Button onClick={() => setEditingTeam({ name: '', role: '', image_emoji: '👤', bio: '', email: '', linkedin: '#', twitter: '#', display_order: 0, is_active: true })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-4xl">{member.image_emoji}</div>
                            <div>
                              <h3 className="text-white font-bold">{member.name}</h3>
                              <p className="text-slate-400 text-sm">{member.role}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingTeam(member)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteTeamMember(member.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {editingTeam && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingTeam.id ? 'Редактировать' : 'Добавить'} члена команды
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Имя"
                      value={editingTeam.name}
                      onChange={(e) => setEditingTeam({...editingTeam, name: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      placeholder="Должность"
                      value={editingTeam.role}
                      onChange={(e) => setEditingTeam({...editingTeam, role: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      placeholder="Эмодзи (👤)"
                      value={editingTeam.image_emoji}
                      onChange={(e) => setEditingTeam({...editingTeam, image_emoji: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Textarea
                      placeholder="Биография"
                      value={editingTeam.bio}
                      onChange={(e) => setEditingTeam({...editingTeam, bio: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      placeholder="Email"
                      value={editingTeam.email}
                      onChange={(e) => setEditingTeam({...editingTeam, email: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      placeholder="LinkedIn"
                      value={editingTeam.linkedin}
                      onChange={(e) => setEditingTeam({...editingTeam, linkedin: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      placeholder="Twitter"
                      value={editingTeam.twitter}
                      onChange={(e) => setEditingTeam({...editingTeam, twitter: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      type="number"
                      placeholder="Порядок отображения"
                      value={editingTeam.display_order}
                      onChange={(e) => setEditingTeam({...editingTeam, display_order: parseInt(e.target.value)})}
                      className="bg-slate-900 text-white"
                    />
                    <div className="flex gap-2">
                      <Button onClick={saveTeamMember} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={() => setEditingTeam(null)}>
                        Отмена
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* CAREERS TAB */}
          <TabsContent value="careers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Вакансии</h2>
                  <Button onClick={() => setEditingCareer({ title: '', department: '', location: '', type: 'full-time', description: '', requirements: '', responsibilities: '', salary_range: '', is_active: true })}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-4">
                  {careers.map((career) => (
                    <Card key={career.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-bold">{career.title}</h3>
                            <p className="text-slate-400 text-sm">{career.department} • {career.location}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingCareer(career)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteCareer(career.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {editingCareer && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingCareer.id ? 'Редактировать' : 'Добавить'} вакансию
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Название"
                      value={editingCareer.title}
                      onChange={(e) => setEditingCareer({...editingCareer, title: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      placeholder="Отдел"
                      value={editingCareer.department}
                      onChange={(e) => setEditingCareer({...editingCareer, department: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Input
                      placeholder="Локация"
                      value={editingCareer.location}
                      onChange={(e) => setEditingCareer({...editingCareer, location: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <select
                      value={editingCareer.type}
                      onChange={(e) => setEditingCareer({...editingCareer, type: e.target.value})}
                      className="w-full p-2 bg-slate-900 text-white rounded"
                    >
                      <option value="full-time">Полная занятость</option>
                      <option value="part-time">Частичная занятость</option>
                      <option value="contract">Контракт</option>
                    </select>
                    <Textarea
                      placeholder="Описание"
                      value={editingCareer.description}
                      onChange={(e) => setEditingCareer({...editingCareer, description: e.target.value})}
                      className="bg-slate-900 text-white"
                      rows={3}
                    />
                    <Textarea
                      placeholder="Требования"
                      value={editingCareer.requirements}
                      onChange={(e) => setEditingCareer({...editingCareer, requirements: e.target.value})}
                      className="bg-slate-900 text-white"
                      rows={4}
                    />
                    <Textarea
                      placeholder="Обязанности"
                      value={editingCareer.responsibilities}
                      onChange={(e) => setEditingCareer({...editingCareer, responsibilities: e.target.value})}
                      className="bg-slate-900 text-white"
                      rows={4}
                    />
                    <Input
                      placeholder="Зарплата"
                      value={editingCareer.salary_range}
                      onChange={(e) => setEditingCareer({...editingCareer, salary_range: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <div className="flex gap-2">
                      <Button onClick={saveCareer} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={() => setEditingCareer(null)}>
                        Отмена
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* PAGES TAB */}
          <TabsContent value="pages">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Статические страницы</h2>

                <div className="space-y-4">
                  {pages.map((page) => (
                    <Card key={page.id} className="bg-slate-800 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-bold">{page.title}</h3>
                            <p className="text-slate-400 text-sm">/{page.slug}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setEditingPage(page)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {editingPage && (
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Редактировать страницу</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Заголовок"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                      className="bg-slate-900 text-white"
                    />
                    <Textarea
                      placeholder="Содержимое (HTML)"
                      value={editingPage.content}
                      onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                      className="bg-slate-900 text-white font-mono text-sm"
                      rows={15}
                    />
                    <div className="flex gap-2">
                      <Button onClick={savePage} className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={() => setEditingPage(null)}>
                        Отмена
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
