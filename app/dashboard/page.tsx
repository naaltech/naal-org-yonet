"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Settings, LogOut, Edit, Plus } from "lucide-react"

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Kulüp Yönetim Paneli</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user?.email}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoş Geldiniz</h2>
          <p className="text-gray-600">Kulüp bilgilerinizi güncelleyin ve sertifika oluşturun.</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Club Information */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Settings className="h-6 w-6 mr-3 text-blue-600" />
                Kulüp Bilgileri
              </CardTitle>
              <CardDescription>
                Kulüp bilgilerinizi, logonuzu ve sosyal medya hesaplarınızı güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => router.push("/club-info")}
              >
                <Edit className="h-4 w-4 mr-2" />
                Bilgileri Güncelle
              </Button>
            </CardContent>
          </Card>

          {/* Certificate Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Award className="h-6 w-6 mr-3 text-green-600" />
                Sertifika Yönetimi
              </CardTitle>
              <CardDescription>
                Kulüp üyeleriniz için sertifika oluşturun ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => router.push("/certificates/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Sertifika Oluştur
              </Button>
            </CardContent>
          </Card>

          {/* My Certificates */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Award className="h-6 w-6 mr-3 text-purple-600" />
                Sertifikalarım
              </CardTitle>
              <CardDescription>
                Oluşturduğunuz sertifikaları görüntüleyin ve yönetin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                className="w-full"
                variant="outline"
                onClick={() => router.push("/certificates")}
              >
                <Award className="h-4 w-4 mr-2" />
                Sertifikalarımı Gör
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
