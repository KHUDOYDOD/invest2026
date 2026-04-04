"use client"

import { useState, useEffect } from "react"

export default function TestLaunchesPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🧪 TEST PAGE: Fetching project launches...')
    
    fetch('/api/admin/project-launches')
      .then(res => {
        console.log('🧪 TEST PAGE: Response status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('🧪 TEST PAGE: Data received:', data)
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('🧪 TEST PAGE: Error:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-4">🧪 Test Project Launches</h1>
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 p-8">
        <h1 className="text-3xl font-bold mb-4">🧪 Test Project Launches</h1>
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    )
  }

  const launchedProjects = data?.filter((p: any) => 
    p.is_launched === true && p.show_on_site && p.is_active
  ) || []

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">🧪 Test Project Launches</h1>
      
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">API Response:</h2>
        <p className="mb-2">Total projects: {data?.length || 0}</p>
        <p className="mb-2">Launched projects: {launchedProjects.length}</p>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {launchedProjects.length > 0 ? (
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">✅ Launched Projects:</h2>
          {launchedProjects.map((project: any) => (
            <div key={project.id} className="bg-white p-4 rounded mb-4">
              <h3 className="text-xl font-bold">🎉 {project.title}</h3>
              <p>{project.description}</p>
              <p className="text-sm text-gray-600 mt-2">
                Launch date: {new Date(project.launch_date).toLocaleString('ru-RU')}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 p-6 rounded-lg">
          <p className="text-lg">⚠️ No launched projects found</p>
        </div>
      )}
    </div>
  )
}
