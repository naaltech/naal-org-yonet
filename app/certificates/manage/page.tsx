"use client"

import { useEffect, useState } from "react"
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  const { user } = useAuth()
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

  if (!user) return <div>Yükleniyor...</div>

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
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
    </div>
  )
} 