import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import {
  User, FileText, Upload, CreditCard, Building2, Banknote,
  MessageCircle, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck,
  Clock, AlertCircle, X, FileCheck
} from 'lucide-react'
import { trpc } from '@/providers/trpc'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useLang } from '@/lib/lang'
import { BANK_DETAILS, COMPANY_INFO } from '@/config'

const visaOptions = [
  { label: '30-Day Visit Visa', price: 'AED 1,200', amount: 120000 },
  { label: '60-Day Visit Visa', price: 'AED 1,800', amount: 180000 },
  { label: 'Visa Extension', price: 'AED 1,100', amount: 110000 },
  { label: 'Inside Country Status Change', price: 'Contact Us', amount: 0 },
  { label: 'PRO Services', price: 'Contact Us', amount: 0 },
]

type FormData = {
  fullName: string
  nationality: string
  currentLocation: string
  phone: string
  email: string
  visaType: string
  travelDate: string
  notes: string
  paymentMethod: string
}

const initialForm: FormData = {
  fullName: '', nationality: '', currentLocation: '',
  phone: '', email: '', visaType: '', travelDate: '',
  notes: '', paymentMethod: '',
}

type UploadedFile = {
  field: string
  fileName: string
  url: string
  size: number
}

// Stripe wrapper component
function StripePaymentForm({ onSuccess, onError }: {
  onSuccess: () => void
  onError: (msg: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })

    if (error) {
      onError(error.message || 'Payment failed')
    } else {
      onSuccess()
    }
    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: { type: 'tabs', defaultCollapsed: false } }} />
      <button type="submit" disabled={!stripe || processing}
        className={`w-full py-3.5 rounded-lg font-semibold transition-colors ${
          processing ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gold text-black hover:bg-gold-dark'
        }`}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export default function ApplyPage() {
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const pageRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [appId, setAppId] = useState<number | null>(null)
  const [stripeError, setStripeError] = useState('')

  // Stripe state
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)
  const [clientSecret, setClientSecret] = useState('')

  // tRPC
  const createApp = trpc.application.create.useMutation()
  const createPayment = trpc.stripe.createPaymentIntent.useMutation()
  const utils = trpc.useUtils()
  const { data: pkData } = trpc.stripe.getPublishableKey.useQuery()

  useEffect(() => {
    window.scrollTo(0, 0)
    if (pkData?.key) {
      setStripePromise(loadStripe(pkData.key))
    }
  }, [pkData])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.apply-step', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08,
      })
    }, pageRef)
    return () => ctx.revert()
  }, [step])

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const selectedVisa = visaOptions.find(v => v.label === form.visaType)

  const handleFileUpload = useCallback(async (field: string, file: File) => {
    const tempId = appId || 'temp'
    const formData = new FormData()
    formData.append('file', file)
    formData.append('field', field)
    formData.append('applicationId', String(tempId))

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.success) {
      setUploads(prev => [...prev.filter(u => u.field !== field), { field, fileName: file.name, url: data.url, size: data.size }])
      return data.url as string
    }
    throw new Error(data.error || 'Upload failed')
  }, [appId])

  const handleDrop = useCallback(async (e: React.DragEvent, field: string) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) await handleFileUpload(field, file)
  }, [handleFileUpload])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) await handleFileUpload(field, file)
  }, [handleFileUpload])

  const removeUpload = (field: string) => {
    setUploads(prev => prev.filter(u => u.field !== field))
  }

  const getUpload = (field: string) => uploads.find(u => u.field === field)

  const handlePaymentSelection = async (method: string) => {
    update('paymentMethod', method)
    if (method === 'Card (Stripe)' && selectedVisa && selectedVisa.amount > 0) {
      // Create application first to get an ID
      const passportUrl = getUpload('passport')?.url || ''
      const photoUrl = getUpload('photo')?.url || ''
      const bankUrl = getUpload('bankStatement')?.url || ''

      const result = await createApp.mutateAsync({
        fullName: form.fullName,
        nationality: form.nationality,
        currentLocation: form.currentLocation,
        phone: form.phone,
        email: form.email,
        visaType: form.visaType,
        travelDate: form.travelDate,
        notes: form.notes,
        paymentMethod: method,
        passportUrl,
        photoUrl,
        bankStatementUrl: bankUrl,
      })

      setAppId(result.id)

      // Now create payment intent
      try {
        const payment = await createPayment.mutateAsync({
          applicationId: result.id,
          visaType: form.visaType,
        })
        setClientSecret(payment.clientSecret || '')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Payment setup failed'
        setStripeError(message)
      }
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const passportUrl = getUpload('passport')?.url || ''
      const photoUrl = getUpload('photo')?.url || ''
      const bankUrl = getUpload('bankStatement')?.url || ''

      if (appId) {
        // Already created during payment selection
        setSubmitted(true)
      } else {
        const result = await createApp.mutateAsync({
          fullName: form.fullName,
          nationality: form.nationality,
          currentLocation: form.currentLocation,
          phone: form.phone,
          email: form.email,
          visaType: form.visaType,
          travelDate: form.travelDate,
          notes: form.notes,
          paymentMethod: form.paymentMethod,
          passportUrl,
          photoUrl,
          bankStatementUrl: bankUrl,
        })
        setAppId(result.id)
        setSubmitted(true)
      }
      utils.admin.stats.invalidate()
      utils.admin.listApplications.invalidate()
    } catch (err) {
      console.error('Submit error:', err)
    }
    setSubmitting(false)
  }

  const stepValid = () => {
    if (step === 1) return form.fullName && form.nationality && form.phone && form.visaType
    if (step === 2) return uploads.length >= 2 // At least passport and photo
    if (step === 3) return form.paymentMethod
    return true
  }

  if (submitted) {
    return (
      <div ref={pageRef} className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div className="max-w-lg w-full text-center apply-step">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Application Submitted!</h2>
          <p className="text-white/60 mb-2">Thank you, <span className="text-gold font-medium">{form.fullName}</span>.</p>
          <p className="text-white/60 mb-2">Your application ID is <span className="text-gold font-mono font-bold">#{appId}</span>.</p>
          <p className="text-white/60 mb-8">Our team will contact you within 24 hours.</p>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-8 text-left">
            <p className="text-gold font-semibold mb-4 flex items-center gap-2"><ShieldCheck size={18} /> What happens next?</p>
            <ol className="space-y-3 text-sm text-white/60">
              <li className="flex gap-3"><span className="text-gold font-bold">1.</span> Documents received: {uploads.length}/3 uploaded</li>
              <li className="flex gap-3"><span className="text-gold font-bold">2.</span> Payment method: {form.paymentMethod}</li>
              <li className="flex gap-3"><span className="text-gold font-bold">3.</span> We process your visa within <strong className="text-white">5 business days</strong></li>
              <li className="flex gap-3"><span className="text-gold font-bold">4.</span> Receive your visa via email/WhatsApp</li>
            </ol>
          </div>

          {form.paymentMethod === 'WhatsApp' && (
            <a href={`https://wa.me/971558689543?text=${encodeURIComponent(`Hi, I submitted application #${appId} for ${form.visaType}. Ready to pay.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="block w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors mb-3">
              <MessageCircle className="inline mr-2" size={18} /> Complete Payment on WhatsApp
            </a>
          )}

          <button onClick={() => { setSubmitted(false); setStep(1); setForm(initialForm); setUploads([]); setAppId(null); setClientSecret('') }}
            className="w-full py-3.5 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
            New Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 apply-step">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">Visa Application</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Apply for UAE Visa</h1>
          <p className="text-white/50 text-sm sm:text-base">Complete the form below. Processing time: <span className="text-gold font-medium">5 business days</span></p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 apply-step">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-gold text-black' : 'bg-white/10 text-white/40'}`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 4 && <div className={`flex-1 h-[2px] rounded transition-colors ${step > s ? 'bg-gold' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs text-white/40 mb-10 -mt-6 apply-step">
          <span className={step >= 1 ? 'text-gold' : ''}>Personal Info</span>
          <span className={step >= 2 ? 'text-gold' : ''}>Documents</span>
          <span className={step >= 3 ? 'text-gold' : ''}>Payment</span>
          <span className={step >= 4 ? 'text-gold' : ''}>Review</span>
        </div>

        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="apply-step bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                <User size={20} className="text-gold" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
                    placeholder={t("ap_fullname_ph")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">Nationality <span className="text-red-400">*</span></label>
                    <input type="text" value={form.nationality} onChange={e => update('nationality', e.target.value)}
                      placeholder={t("ap_nationality_ph")}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">Current Location</label>
                    <input type="text" value={form.currentLocation} onChange={e => update('currentLocation', e.target.value)}
                      placeholder={t("ap_location_ph")}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">Phone / WhatsApp <span className="text-red-400">*</span></label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                      placeholder={t("ap_phone_ph")}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">Email Address</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                      placeholder={t("ap_email_ph")}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div className="apply-step bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                <FileText size={20} className="text-gold" /> Visa Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Select Visa Type <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {visaOptions.map(opt => (
                      <button key={opt.label} onClick={() => update('visaType', opt.label)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          form.visaType === opt.label ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                        }`}>
                        <p className={`font-medium text-sm ${form.visaType === opt.label ? 'text-gold' : 'text-white'}`}>{opt.label}</p>
                        <p className="text-white/40 text-xs mt-0.5">{opt.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Expected Travel Date</label>
                  <input type="date" value={form.travelDate} onChange={e => update('travelDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-gold focus:outline-none transition-colors [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Additional Notes</label>
                  <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
                    placeholder={t("ap_notes_ph")}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors resize-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Document Upload */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="apply-step bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-400 font-medium text-sm">Processing Time: 5 Business Days</p>
                  <p className="text-white/50 text-xs mt-1">Upload all 3 documents to begin processing. If your visa is rejected, a partial refund will be issued.</p>
                </div>
              </div>
            </div>

            <div className="apply-step bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                <Upload size={20} className="text-gold" /> Upload Required Documents
              </h3>

              <div className="space-y-4">
                {[
                  { field: 'passport', label: 'Passport Copy (Data Page)', desc: 'Clear photo of your passport information page', icon: FileText, accept: 'image/*,.pdf' },
                  { field: 'photo', label: 'Passport Size Photo', desc: 'White background, recent photograph', icon: Upload, accept: 'image/*' },
                  { field: 'bankStatement', label: '6-Month Bank Statement', desc: 'PDF or clear photo of your bank statement', icon: FileCheck, accept: 'image/*,.pdf' },
                ].map(doc => {
                  const existing = getUpload(doc.field)
                  return (
                    <div key={doc.field}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDrop(e, doc.field)}
                      className={`relative p-5 rounded-xl border-2 border-dashed transition-all ${
                        existing ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/[0.02] hover:border-gold/30'
                      }`}>
                      {existing ? (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 size={24} className="text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-green-400 font-medium text-sm">{doc.label}</p>
                            <p className="text-white/40 text-xs truncate">{existing.fileName} ({(existing.size / 1024).toFixed(0)} KB)</p>
                          </div>
                          <button onClick={() => removeUpload(doc.field)}
                            className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <input type="file" accept={doc.accept} className="hidden"
                            onChange={e => handleFileSelect(e, doc.field)} />
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                              <doc.icon size={24} className="text-gold" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm">{doc.label}</p>
                              <p className="text-white/40 text-xs">{doc.desc}</p>
                              <p className="text-gold text-xs mt-1.5 font-medium">Click to upload or drag & drop</p>
                            </div>
                          </div>
                        </label>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 p-4 rounded-lg bg-gold/5 border border-gold/20">
                <p className="text-gold font-medium text-sm mb-2 flex items-center gap-2"><FileCheck size={16} /> Documents Status: {uploads.length}/3 uploaded</p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${(uploads.length / 3) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="apply-step bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                <CreditCard size={20} className="text-gold" /> Select Payment Method
              </h3>
              {selectedVisa && (
                <p className="text-white/50 text-sm mb-5">
                  Amount due: <span className="text-gold font-bold text-lg">{selectedVisa.price}</span>
                </p>
              )}

              <div className="space-y-3">
                {selectedVisa && selectedVisa.amount > 0 && (
                  <button onClick={() => handlePaymentSelection('Card (Stripe)')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      form.paymentMethod === 'Card (Stripe)' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${form.paymentMethod === 'Card (Stripe)' ? 'bg-gold/20' : 'bg-white/5'}`}>
                      <CreditCard size={24} className="text-gold" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${form.paymentMethod === 'Card (Stripe)' ? 'text-gold' : 'text-white'}`}>Pay with Card</p>
                      <p className="text-white/40 text-xs">Secure payment via Stripe</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'Card (Stripe)' ? 'border-gold' : 'border-white/30'}`}>
                      {form.paymentMethod === 'Card (Stripe)' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                    </div>
                  </button>
                )}

                <button onClick={() => { update('paymentMethod', 'Bank Transfer'); setAppId(null); setClientSecret('') }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    form.paymentMethod === 'Bank Transfer' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${form.paymentMethod === 'Bank Transfer' ? 'bg-gold/20' : 'bg-white/5'}`}>
                    <Building2 size={24} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${form.paymentMethod === 'Bank Transfer' ? 'text-gold' : 'text-white'}`}>Bank Transfer</p>
                    <p className="text-white/40 text-xs">Transfer to our FAB account</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'Bank Transfer' ? 'border-gold' : 'border-white/30'}`}>
                    {form.paymentMethod === 'Bank Transfer' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                  </div>
                </button>

                <button onClick={() => { update('paymentMethod', 'WhatsApp'); setAppId(null); setClientSecret('') }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    form.paymentMethod === 'WhatsApp' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${form.paymentMethod === 'WhatsApp' ? 'bg-green-500/20' : 'bg-white/5'}`}>
                    <MessageCircle size={24} className="text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${form.paymentMethod === 'WhatsApp' ? 'text-gold' : 'text-white'}`}>Pay via WhatsApp</p>
                    <p className="text-white/40 text-xs">Send payment details on WhatsApp</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'WhatsApp' ? 'border-gold' : 'border-white/30'}`}>
                    {form.paymentMethod === 'WhatsApp' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                  </div>
                </button>

                <button onClick={() => { update('paymentMethod', 'Cash'); setAppId(null); setClientSecret('') }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    form.paymentMethod === 'Cash' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${form.paymentMethod === 'Cash' ? 'bg-gold/20' : 'bg-white/5'}`}>
                    <Banknote size={24} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${form.paymentMethod === 'Cash' ? 'text-gold' : 'text-white'}`}>Cash Payment</p>
                    <p className="text-white/40 text-xs">Visit our office in Abu Dhabi</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === 'Cash' ? 'border-gold' : 'border-white/30'}`}>
                    {form.paymentMethod === 'Cash' && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                  </div>
                </button>
              </div>

              {/* Payment details panels */}
              {form.paymentMethod === 'Bank Transfer' && (
                <div className="mt-4 p-5 rounded-lg bg-white/[0.03] border border-white/10">
                  <p className="text-gold font-medium text-sm mb-3 flex items-center gap-2"><Building2 size={16} /> Bank Transfer Details</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-white/40">Bank</span><span className="text-white font-medium">First Abu Dhabi Bank (FAB)</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Account Name</span><span className="text-white font-medium">ASK MIAN LLC</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Account Number</span><span className="text-white font-medium">1234567890</span></div>
                    <div className="flex justify-between"><span className="text-white/40">IBAN</span><span className="text-white font-medium font-mono text-xs">AE123456789012345678901</span></div>
                  </div>
                  <p className="text-white/40 text-xs mt-4">After transfer, please send your receipt via WhatsApp.</p>
                </div>
              )}

              {form.paymentMethod === 'Cash' && (
                <div className="mt-4 p-5 rounded-lg bg-white/[0.03] border border-white/10">
                  <p className="text-gold font-medium text-sm mb-3 flex items-center gap-2"><Banknote size={16} /> Office Address</p>
                  <div className="space-y-1 text-sm text-white/60">
                    <p>Office on Appointment</p>
                    <p>Abu Dhabi, United Arab Emirates</p>
                    <p>Mon - Fri: 9:00 AM - 9:00 PM</p>
                    <p className="text-gold">+971 55 868 9543</p>
                  </div>
                </div>
              )}

              {/* Stripe Payment Form */}
              {form.paymentMethod === 'Card (Stripe)' && clientSecret && stripePromise && (
                <div className="mt-4 p-5 rounded-lg bg-white/[0.03] border border-white/10">
                  <p className="text-gold font-medium text-sm mb-4 flex items-center gap-2"><CreditCard size={16} /> Secure Card Payment</p>
                  {stripeError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{stripeError}</div>
                  )}
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#D4AF37', colorBackground: '#171717', colorText: '#ffffff' } } }}>
                    <StripePaymentForm
                      onSuccess={() => {
                        setSubmitted(true)
                        utils.admin.stats.invalidate()
                        utils.admin.listApplications.invalidate()
                      }}
                      onError={(msg) => setStripeError(msg)}
                    />
                  </Elements>
                </div>
              )}

              {form.paymentMethod === 'Card (Stripe)' && !clientSecret && !stripeError && (
                <div className="mt-4 p-5 rounded-lg bg-white/[0.03] border border-white/10 text-center">
                  <p className="text-white/50 text-sm">Click &quot;Pay with Card&quot; above to set up secure payment.</p>
                </div>
              )}

              {form.paymentMethod === 'WhatsApp' && (
                <div className="mt-4 p-5 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
                  <p className="text-green-400 text-sm">You will be redirected to WhatsApp to complete payment after submission.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Review */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="apply-step bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
                <ShieldCheck size={20} className="text-gold" /> Review Your Application
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-white/40 text-xs">Full Name</p><p className="text-white font-medium">{form.fullName}</p></div>
                  <div><p className="text-white/40 text-xs">Nationality</p><p className="text-white font-medium">{form.nationality}</p></div>
                  <div><p className="text-white/40 text-xs">Phone</p><p className="text-white font-medium">{form.phone}</p></div>
                  <div><p className="text-white/40 text-xs">Email</p><p className="text-white font-medium">{form.email || 'N/A'}</p></div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white/40 text-xs">Visa Type</p>
                      <p className="text-gold font-medium">{form.visaType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs">Price</p>
                      <p className="text-gold font-bold">{selectedVisa?.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-xs">Payment Method</p>
                      <p className="text-white font-medium">{form.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs">Processing</p>
                      <p className="text-white font-medium">5 business days</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-white/40 text-xs mb-2">Documents Uploaded ({uploads.length}/3)</p>
                  <div className="flex flex-wrap gap-2">
                    {uploads.map(u => (
                      <span key={u.field} className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> {u.field === 'passport' ? 'Passport' : u.field === 'photo' ? 'Photo' : 'Bank Statement'}
                      </span>
                    ))}
                    {uploads.length === 0 && <span className="text-white/30 text-xs">No documents uploaded yet</span>}
                  </div>
                </div>
                {form.travelDate && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-white/40 text-xs">Travel Date</p>
                    <p className="text-white font-medium">{form.travelDate}</p>
                  </div>
                )}
                {form.notes && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-white/40 text-xs">Notes</p>
                    <p className="text-white/60 text-sm">{form.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="apply-step bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/50">
                  <p className="text-amber-400 font-medium mb-1">Important Notice</p>
                  <p>By submitting, you confirm all information is accurate. Visa approval is subject to immigration authority decision. <strong className="text-white">Partial refund available if visa is rejected.</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mt-8 apply-step">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/5 text-white font-medium rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/5 text-white font-medium rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} /> Cancel
            </button>
          )}

          {step < 4 && form.paymentMethod !== 'Card (Stripe)' && (
            <button onClick={() => setStep(step + 1)} disabled={!stepValid()}
              className={`flex items-center gap-2 px-8 py-3.5 font-semibold rounded-lg transition-colors ${
                stepValid() ? 'bg-gold text-black hover:bg-gold-dark' : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}>
              Continue <ArrowRight size={16} />
            </button>
          )}

          {step === 4 && (
            <button onClick={handleSubmit} disabled={submitting}
              className={`flex items-center gap-2 px-8 py-3.5 font-semibold rounded-lg transition-colors ${
                submitting ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-gold text-black hover:bg-gold-dark'
              }`}>
              {submitting ? 'Submitting...' : <><CheckCircle2 size={18} /> Submit Application</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
