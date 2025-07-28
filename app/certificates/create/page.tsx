'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Award, Save, LogOut, Upload, FileText } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Club {
  title: string
  owners: string[]
  instagram: string[]
  urls: string[]
}

type MessageType = {
  type: 'success' | 'error'
  text: string
}

export default function CreateCertificate() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  
  const [club, setClub] = useState<Club>({ title: '', owners: [], instagram: [], urls: [] })
  const [digitalFormData, setDigitalFormData] = useState({
    creator: '',
    head: '',
    given: '',
    date: new Date().toISOString().split('T')[0],
    file_id: ''
  })
  const [pdfFormData, setPdfFormData] = useState({
    uid: '',
    given: '',
    cert_name: '',
    pdf_link: '',
    creator: ''
  })
  const [message, setMessage] = useState<MessageType | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [allClubs, setAllClubs] = useState<Club[]>([])
  const [selectedClubTitle, setSelectedClubTitle] = useState<string>('')


  // Kulüp bilgilerini YALNIZCA kullanıcı giriş yaptıysa ve henüz yüklenmediyse çek
  useEffect(() => {
    if (!user) return;
    if (club.title) return; // club zaten yüklendiyse tekrar çekme

    const fetchClubInfo = async () => {
      const userEmail = user?.email
      if (userEmail === 'admin@naal.org.tr') {
        // Admin: tüm kulüpleri çek
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .order('title', { ascending: true })
        if (data && data.length > 0) {
          setAllClubs(data)
          setSelectedClubTitle(data[0].title)
          // Varsayılan olarak ilk kulübü formda göster
          setClub({
            title: data[0].title,
            owners: Array.isArray(data[0].owners) ? data[0].owners : (typeof data[0].owners === 'string' && data[0].owners !== undefined && data[0].owners !== null ? data[0].owners.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []),
            instagram: Array.isArray(data[0].instagram) ? data[0].instagram : (typeof data[0].instagram === 'string' && data[0].instagram !== undefined && data[0].instagram !== null ? data[0].instagram.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []),
            urls: Array.isArray(data[0].urls) ? data[0].urls : (typeof data[0].urls === 'string' && data[0].urls !== undefined && data[0].urls !== null ? data[0].urls.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []),
          })
          setDigitalFormData(prev => ({ ...prev, creator: data[0].title }))
          setPdfFormData(prev => ({ ...prev, creator: data[0].title }))
        }
      } else {
        // Normal kullanıcı: kendi kulübünü çek
        let clubCode = ''
        if (userEmail === 'tech@naal.org.tr') {
          clubCode = 'tech'
        } else {
          clubCode = userEmail?.split('@')[0] || ''
        }
        const { data, error } = await supabase
          .from('clubs')
          .select('*')
          .eq('code', clubCode)
          .single()
        if (data) {
          const owners = data.owners ? (Array.isArray(data.owners) ? data.owners : data.owners.split(',').map((s: string) => s.trim()).filter((s: string) => s)) : []
          const urls = data.urls ? (Array.isArray(data.urls) ? data.urls : data.urls.split(',').map((s: string) => s.trim()).filter((s: string) => s)) : []
          const instagram = data.instagram ? (Array.isArray(data.instagram) ? data.instagram : data.instagram.split(',').map((s: string) => s.trim()).filter((s: string) => s)) : []
          setClub({
            ...data,
            owners,
            urls,
            instagram
          })
          setDigitalFormData(prev => ({
            ...prev,
            creator: prev.creator || data.title || ''
          }))
          setPdfFormData(prev => ({
            ...prev,
            creator: prev.creator || data.title || ''
          }))
        }
      }
    }
    fetchClubInfo()
  }, [user, club.title])

  // Admin kulüp seçince formu güncelle
  useEffect(() => {
    if (user?.email === 'admin@naal.org.tr' && allClubs.length > 0 && selectedClubTitle) {
      const found = allClubs.find(c => c.title === selectedClubTitle)
      if (found) {
        setClub({
          title: found.title,
          owners: Array.isArray(found.owners) ? found.owners : (typeof found.owners === 'string' && found.owners !== undefined && found.owners !== null ? found.owners.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []),
          instagram: Array.isArray(found.instagram) ? found.instagram : (typeof found.instagram === 'string' && found.instagram !== undefined && found.instagram !== null ? found.instagram.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []),
          urls: Array.isArray(found.urls) ? found.urls : (typeof found.urls === 'string' && found.urls !== undefined && found.urls !== null ? found.urls.split(',').map((s: string) => s.trim()).filter((s: string) => s) : []),
        })
        setDigitalFormData(prev => ({ ...prev, creator: found.title }))
        setPdfFormData(prev => ({ ...prev, creator: found.title }))
      }
    }
  }, [selectedClubTitle])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    // Mesajları 5 saniye sonra temizle
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [user, router, message])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const handleDigitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!digitalFormData.head.trim() || !digitalFormData.given.trim()) {
      setMessage({ type: 'error', text: 'Lütfen tüm zorunlu alanları doldurun' })
      return
    }

    setSaving(true)
    try {
      // file_id yoksa otomatik oluştur
      const fileId = digitalFormData.file_id?.trim() || generateUID()
      const { error } = await supabase
        .from('cert')
        .insert({
          creator: user?.email === 'admin@naal.org.tr' ? selectedClubTitle : (digitalFormData.creator.trim() || club.title),
          head: digitalFormData.head.trim(),
          given: digitalFormData.given.trim(),
          date: digitalFormData.date,
          file_id: fileId,
          uploader_mail: user?.email || ''
        })

      if (error) {
        console.error('Error creating certificate:', error)
        setMessage({ type: 'error', text: 'Dijital sertifika oluşturulurken hata oluştu' })
      } else {
        setMessage({ type: 'success', text: 'Dijital sertifika başarıyla oluşturuldu!' })
        // Form'u temizle
        setDigitalFormData({
          creator: club?.title || '',
          head: '',
          given: '',
          date: new Date().toISOString().split('T')[0],
          file_id: ''
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const generateUID = (): string => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const timestamp = currentDate.getTime().toString().slice(-6) // Son 6 hanesi
    
    return `CERT-${year}${month}${day}-${timestamp}`
  }

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pdfFormData.given.trim() || !pdfFormData.cert_name.trim() || !pdfFormData.pdf_link.trim()) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun' })
      return
    }

    setSaving(true)
    try {
      // UID yoksa otomatik oluştur
      const finalUID = pdfFormData.uid.trim() || generateUID()
      
      const { error } = await supabase
        .from('cert_pdf')
        .insert({
          uid: finalUID,
          given: pdfFormData.given.trim(),
          cert_name: pdfFormData.cert_name.trim(),
          pdf_link: pdfFormData.pdf_link.trim(),
          creator: user?.email === 'admin@naal.org.tr' ? selectedClubTitle : (pdfFormData.creator.trim() || club.title),
          uploader_mail: user?.email || ''
        })

      if (error) {
        console.error('Error creating PDF certificate:', error)
        setMessage({ type: 'error', text: 'PDF sertifika oluşturulurken hata oluştu' })
      } else {
        setMessage({ type: 'success', text: 'PDF sertifika başarıyla oluşturuldu!' })
        // Form'u temizle
        setPdfFormData({
          uid: '',
          given: '',
          cert_name: '',
          pdf_link: '',
          creator: ''
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const uploadToCatbox = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('fileToUpload', file)
    formData.append('reqtype', 'fileupload')

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return await response.text() // Catbox direkt URL döner
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // PDF kontrolü
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Lütfen sadece PDF dosyası yükleyin' })
      return
    }

    // Dosya boyutu kontrolü (200MB limit)
    const maxSize = 200 * 1024 * 1024 // 200MB
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Dosya boyutu 200MB\'dan büyük olamaz' })
      return
    }

    setUploading(true)
    try {
      const uploadedUrl = await uploadToCatbox(file)
      setPdfFormData(prev => ({ ...prev, pdf_link: uploadedUrl }))
      setMessage({ type: 'success', text: 'PDF dosyası başarıyla yüklendi!' })
    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: 'PDF yükleme hatası' })
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="mr-3"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Geri
              </Button>
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Sertifika Oluştur</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user.email}</Badge>
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
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-6">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Yeni Sertifika Oluştur</CardTitle>
            <CardDescription>
              {club.title} kulübü adına sertifika oluşturun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="digital" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="digital" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Dijital Sertifika
                </TabsTrigger>
                <TabsTrigger value="pdf" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  PDF Sertifika
                </TabsTrigger>
              </TabsList>

              {/* Digital Certificate Form */}
              <TabsContent value="digital" className="space-y-6 mt-6">
                <form onSubmit={handleDigitalSubmit} className="space-y-6">
                  {/* Admin için kulüp seçimi */}
                  {user.email === 'admin@naal.org.tr' && allClubs.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="admin-club-select">Kulüp Seç</Label>
                      <Select value={selectedClubTitle} onValueChange={val => setSelectedClubTitle(val)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kulüp seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {allClubs.map(club => (
                            <SelectItem key={club.title} value={club.title}>{club.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {/* Creator Info */}
                  <div className="space-y-2">
                    <Label htmlFor="digital-creator">Veren Kurum/Kişi</Label>
                    <Input
                      id="digital-creator"
                      value={digitalFormData.creator}
                      onChange={(e) => setDigitalFormData(prev => ({ ...prev, creator: e.target.value }))}
                      placeholder={club.title ? `Varsayılan: ${club.title}` : 'Veren kurum/kişi'}
                    />
                    <p className="text-sm text-gray-500">Boş bırakılırsa varsayılan kulüp adı kullanılır</p>
                  </div>

                  {/* Certificate Title/Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="digital-head">Sertifika Konusu/Başlığı <span className="text-red-500">*</span></Label>
                    <Input
                      id="digital-head"
                      value={digitalFormData.head}
                      onChange={(e) => setDigitalFormData(prev => ({ ...prev, head: e.target.value }))}
                      placeholder="Örn: React Eğitimi Tamamlama Sertifikası"
                      required
                    />
                    <p className="text-sm text-gray-500">Sertifikanın konusunu veya başlığını girin</p>
                  </div>

                  {/* Recipient Name */}
                  <div className="space-y-2">
                    <Label htmlFor="digital-given">Sertifikayı Alan Kişi <span className="text-red-500">*</span></Label>
                    <Input
                      id="digital-given"
                      value={digitalFormData.given}
                      onChange={(e) => setDigitalFormData(prev => ({ ...prev, given: e.target.value }))}
                      placeholder="Örn: Ali Veli"
                      required
                    />
                    <p className="text-sm text-gray-500">Sertifikayı alacak kişinin tam adını girin</p>
                  </div>

                  {/* Certificate Date */}
                  <div className="space-y-2">
                    <Label htmlFor="digital-date">Sertifika Tarihi <span className="text-red-500">*</span></Label>
                    <Input
                      id="digital-date"
                      type="date"
                      value={digitalFormData.date}
                      onChange={(e) => setDigitalFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                    <p className="text-sm text-gray-500">Sertifikanın verildiği tarihi seçin</p>
                  </div>

                  {/* File ID Field */}
                  <div className="space-y-2">
                    <Label htmlFor="digital-file-id">Sertifika ID (Opsiyonel)</Label>
                    <Input
                      id="digital-file-id"
                      value={digitalFormData.file_id}
                      onChange={(e) => setDigitalFormData(prev => ({ ...prev, file_id: e.target.value }))}
                      placeholder="Boş bırakılırsa otomatik oluşturulur"
                    />
                    <p className="text-sm text-gray-500">Özel bir ID vermek isterseniz girin, yoksa otomatik oluşturulur</p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Oluşturuluyor...' : 'Dijital Sertifika Oluştur'}
                  </Button>
                </form>
              </TabsContent>

              {/* PDF Certificate Form */}
              <TabsContent value="pdf" className="space-y-6 mt-6">
                <form onSubmit={handlePdfSubmit} className="space-y-6">
                  {/* Admin için kulüp seçimi */}
                  {user.email === 'admin@naal.org.tr' && allClubs.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="admin-club-select-pdf">Kulüp Seç</Label>
                      <Select value={selectedClubTitle} onValueChange={val => setSelectedClubTitle(val)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kulüp seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {allClubs.map(club => (
                            <SelectItem key={club.title} value={club.title}>{club.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {/* PDF Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="pdf-upload">PDF Dosyası <span className="text-red-500">*</span></Label>
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <p className="text-sm text-gray-500">
                      {uploading ? 'Yükleniyor...' : 'PDF dosyasını seçin (Maksimum 200MB)'}
                    </p>
                    {pdfFormData.pdf_link && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">✓ PDF başarıyla yüklendi!</p>
                        <a 
                          href={pdfFormData.pdf_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Yüklenen dosyayı görüntüle
                        </a>
                      </div>
                    )}
                  </div>

                  {/* UID Field */}
                  <div className="space-y-2">
                    <Label htmlFor="pdf-uid">Sertifika ID (Opsiyonel)</Label>
                    <Input
                      id="pdf-uid"
                      value={pdfFormData.uid}
                      onChange={(e) => setPdfFormData(prev => ({ ...prev, uid: e.target.value }))}
                      placeholder="Boş bırakılırsa otomatik oluşturulur"
                    />
                    <p className="text-sm text-gray-500">Özel bir ID vermek isterseniz girin, yoksa otomatik oluşturulur</p>
                  </div>

                  {/* Creator Field */}
                  <div className="space-y-2">
                    <Label htmlFor="pdf-creator">Veren Kurum/Kişi</Label>
                    <Input
                      id="pdf-creator"
                      value={pdfFormData.creator}
                      onChange={(e) => setPdfFormData(prev => ({ ...prev, creator: e.target.value }))}
                      placeholder={club.title ? `Varsayılan: ${club.title}` : 'Veren kurum/kişi'}
                    />
                    <p className="text-sm text-gray-500">Boş bırakılırsa varsayılan kulüp adı kullanılır</p>
                  </div>

                  {/* Recipient Name */}
                  <div className="space-y-2">
                    <Label htmlFor="pdf-given">Sertifikayı Alan Kişi <span className="text-red-500">*</span></Label>
                    <Input
                      id="pdf-given"
                      value={pdfFormData.given}
                      onChange={(e) => setPdfFormData(prev => ({ ...prev, given: e.target.value }))}
                      placeholder="Örn: Ali Veli"
                      required
                    />
                    <p className="text-sm text-gray-500">Sertifikayı alan kişinin tam adını girin</p>
                  </div>

                  {/* Certificate Name */}
                  <div className="space-y-2">
                    <Label htmlFor="pdf-cert-name">Sertifika Adı <span className="text-red-500">*</span></Label>
                    <Input
                      id="pdf-cert-name"
                      value={pdfFormData.cert_name}
                      onChange={(e) => setPdfFormData(prev => ({ ...prev, cert_name: e.target.value }))}
                      placeholder="Örn: Web Geliştirme Bootcamp Sertifikası"
                      required
                    />
                    <p className="text-sm text-gray-500">Sertifikanın tam adını girin</p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={saving || !pdfFormData.pdf_link}
                    className="w-full"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Oluşturuluyor...' : 'PDF Sertifika Oluştur'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
