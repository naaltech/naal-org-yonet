"use client"

import { useEffect, useState } from "react"
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Settings, LogOut } from 'lucide-react'

interface Cert {
  id: number
  created_at: string
  creator: string
  head: string
  given: string
  date: string
  file_id: string
  uploader_mail: string
}

interface CertPdf {
  id: number
  created_at: string
  pdf_link: string
  given: string
  from: string
  date: string | null
  uid: string
  cert_name: string
  uploader_mail: string
}

type MessageType = {
  type: 'success' | 'error'
  text: string
}

type EditType = {
  type: 'cert' | 'cert_pdf'
  data: Cert | CertPdf
}

export default function ManageCertificates() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [certs, setCerts] = useState<Cert[]>([])
  const [certPdfs, setCertPdfs] = useState<CertPdf[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<MessageType | null>(null)
  const [editModal, setEditModal] = useState<{ open: boolean, edit: EditType | null }>({ open: false, edit: null })
  const [editForm, setEditForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchData = async () => {
      if (!user) return;
      const mailFilter = user.email === 'admin@naal.org.tr' ? {} : { uploader_mail: user.email };
      const { data: certsData } = await supabase
        .from('cert')
        .select('*')
        .order('created_at', { ascending: false })
        .match(mailFilter);
      setCerts(certsData || []);
      const { data: certPdfsData } = await supabase
        .from('cert_pdf')
        .select('*')
        .order('created_at', { ascending: false })
        .match(mailFilter);
      setCertPdfs(certPdfsData || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Modal açıldığında formu doldur
  const openEditModal = (type: 'cert' | 'cert_pdf', data: Cert | CertPdf) => {
    setEditForm({ ...data })
    setEditModal({ open: true, edit: { type, data } })
  }

  // Kaydet (update)
  const handleSave = async () => {
    if (!editModal.edit) return
    setSaving(true)
    try {
      let error
      if (editModal.edit.type === 'cert') {
        const { id, creator, head, given, date, file_id } = editForm
        ;({ error } = await supabase
          .from('cert')
          .update({ creator, head, given, date, file_id })
          .eq('id', id)
        )
      } else {
        const { id, pdf_link, given, from, date, uid, cert_name } = editForm
        ;({ error } = await supabase
          .from('cert_pdf')
          .update({ pdf_link, given, from, date, uid, cert_name })
          .eq('id', id)
        )
      }
      if (error) {
        setMessage({ type: 'error', text: 'Güncelleme sırasında hata oluştu' })
      } else {
        setMessage({ type: 'success', text: 'Başarıyla güncellendi!' })
        setEditModal({ open: false, edit: null })
        // Listeyi güncelle
        setLoading(true)
        const mailFilter = user.email === 'admin@naal.org.tr' ? {} : { uploader_mail: user.email }
        const { data: certsData } = await supabase
          .from('cert')
          .select('*')
          .order('created_at', { ascending: false })
          .match(mailFilter)
        setCerts(certsData || [])
        const { data: certPdfsData } = await supabase
          .from('cert_pdf')
          .select('*')
          .order('created_at', { ascending: false })
          .match(mailFilter)
        setCertPdfs(certPdfsData || [])
        setLoading(false)
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  if (!user) return <div>Yükleniyor...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-zinc-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/80 shadow-lg border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="mr-4 hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Ana Sayfa
              </Button>
              <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl mr-4 shadow-lg">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sertifika Yönetimi</h1>
                <p className="text-sm text-gray-600">Sertifikalarınızı düzenleyin ve yönetin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Hoş geldiniz</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto py-8 px-4">
      <Card className="backdrop-blur-sm bg-white/80 border-gray-200/50 shadow-xl">
        <CardHeader>
          <CardTitle>Sertifikalarım</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mb-4">
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <div>Yükleniyor...</div>
          ) : (
            <>
              <h2 className="font-semibold mt-2 mb-1">Dijital Sertifikalar</h2>
              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Başlık</th>
                    <th className="text-left py-1">Alan</th>
                    <th className="text-left py-1">Tarih</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map(cert => (
                    <tr key={cert.id} className="border-b">
                      <td>{cert.head}</td>
                      <td>{cert.given}</td>
                      <td>{cert.date}</td>
                      <td>
                        <Button size="sm" variant="outline" onClick={() => openEditModal('cert', cert)}>Düzenle</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2 className="font-semibold mt-2 mb-1">PDF Sertifikalar</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Ad</th>
                    <th className="text-left py-1">PDF</th>
                    <th className="text-left py-1">Tarih</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {certPdfs.map(cert => (
                    <tr key={cert.id} className="border-b">
                      <td>{cert.given}</td>
                      <td>
                        {cert.pdf_link ? (
                          <a href={cert.pdf_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">PDF</a>
                        ) : '-'}
                      </td>
                      <td>{cert.date || '-'}</td>
                      <td>
                        <Button size="sm" variant="outline" onClick={() => openEditModal('cert_pdf', cert)}>Düzenle</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Düzenleme Modalı */}
      <Dialog open={editModal.open} onOpenChange={open => !open && setEditModal({ open: false, edit: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sertifika Düzenle</DialogTitle>
          </DialogHeader>
          {editModal.edit && (
            <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-4">
              {editModal.edit.type === 'cert' ? (
                <>
                  <div>
                    <Label>Başlık</Label>
                    <Input value={editForm.head} onChange={e => setEditForm((f: any) => ({ ...f, head: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Alan Kişi</Label>
                    <Input value={editForm.given} onChange={e => setEditForm((f: any) => ({ ...f, given: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Tarih</Label>
                    <Input type="date" value={editForm.date} onChange={e => setEditForm((f: any) => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Veren Kurum/Kişi</Label>
                    <Input value={editForm.creator} onChange={e => setEditForm((f: any) => ({ ...f, creator: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Sertifika ID</Label>
                    <Input value={editForm.file_id} onChange={e => setEditForm((f: any) => ({ ...f, file_id: e.target.value }))} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Ad</Label>
                    <Input value={editForm.given} onChange={e => setEditForm((f: any) => ({ ...f, given: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Sertifika Adı</Label>
                    <Input value={editForm.cert_name} onChange={e => setEditForm((f: any) => ({ ...f, cert_name: e.target.value }))} />
                  </div>
                  <div>
                    <Label>PDF Link</Label>
                    <Input value={editForm.pdf_link} onChange={e => setEditForm((f: any) => ({ ...f, pdf_link: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Veren Kurum/Kişi</Label>
                    <Input value={editForm.from} onChange={e => setEditForm((f: any) => ({ ...f, from: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Tarih</Label>
                    <Input type="date" value={editForm.date || ''} onChange={e => setEditForm((f: any) => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Sertifika ID</Label>
                    <Input value={editForm.uid} onChange={e => setEditForm((f: any) => ({ ...f, uid: e.target.value }))} />
                  </div>
                </>
              )}
              <DialogFooter>
                <Button type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      </main>
    </div>
  )
} 