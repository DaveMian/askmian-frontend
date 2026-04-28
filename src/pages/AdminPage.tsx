import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { trpc } from '@/providers/trpc'
import {
  Users, Clock, CheckCircle2, TrendingUp,
  FileText, Eye, RefreshCw, ArrowLeft, Search, Filter,
  ChevronDown, ExternalLink, Banknote, MessageCircle,
  Lock, AlertTriangle
} from 'lucide-react'

export default function AdminPage() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedApp, setSelectedApp] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminToken') === 'askmian-admin-session'
  })

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, { enabled: isLoggedIn })
  const { data: applications, isLoading: appsLoading } = trpc.admin.listApplications.useQuery({ limit: 100, offset: 0 }, { enabled: isLoggedIn })
  const utils = trpc.useUtils()
  const updateStatus = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      utils.admin.stats.invalidate()
      utils.admin.listApplications.invalidate()
    },
  })
  const login = trpc.adminAuth.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem('adminToken', data.token || '')
        setIsLoggedIn(true)
        setLoginError('')
      } else {
        setLoginError(data.error || 'Login failed')
      }
    },
    onError: () => {
      setLoginError('Server error. Please try again.')
    },
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    login.mutate({ password })
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    setPassword('')
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-gold" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-white/50 text-sm">Enter your admin password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending || !password.trim()}
              className={`w-full py-3.5 rounded-lg font-semibold transition-colors ${
                login.isPending || !password.trim()
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-gold text-black hover:bg-gold-dark'
              }`}
            >
              {login.isPending ? 'Verifying...' : 'Login'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 w-full mt-4 text-white/40 text-sm hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Website
          </button>

          <div className="mt-6 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-amber-400 text-xs text-center">
              Set your password via Railway environment variable: ADMIN_PASSWORD
            </p>
          </div>
        </div>
      </div>
    )
  }

  const filteredApps = (applications || []).filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    const matchesSearch = !searchTerm ||
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.visaType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(app.id).includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const selectedApplication = applications?.find(a => a.id === selectedApp)

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  const paymentStatusColors: Record<string, string> = {
    pending: 'text-amber-400',
    paid: 'text-green-400',
    succeeded: 'text-green-400',
    failed: 'text-red-400',
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-white/40 text-sm hover:text-gold transition-colors mb-2">
              <ArrowLeft size={14} /> Back to Website
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40 text-sm">Manage visa applications and payments</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { utils.admin.stats.invalidate(); utils.admin.listApplications.invalidate(); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-white text-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors">
              <Lock size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: stats?.total ?? 0, icon: Users, color: 'text-white' },
            { label: 'Pending', value: stats?.pending ?? 0, icon: Clock, color: 'text-amber-400' },
            { label: 'Processing', value: stats?.processing ?? 0, icon: FileText, color: 'text-blue-400' },
            { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle2, color: 'text-green-400' },
            { label: 'Revenue (AED)', value: stats?.revenue ? (stats.revenue / 100).toLocaleString() : '0', icon: TrendingUp, color: 'text-gold' },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={18} className={stat.color} />
                {statsLoading && <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-gold animate-spin" />}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, visa type..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-white/40" />
            {['all', 'pending', 'processing', 'completed', 'rejected'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s ? 'bg-gold text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase">ID</th>
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase">Name</th>
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase hidden md:table-cell">Visa Type</th>
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase hidden lg:table-cell">Phone</th>
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase">Status</th>
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase hidden sm:table-cell">Payment</th>
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase">Date</th>
                  <th className="px-4 py-3 text-white/40 text-xs font-medium uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {appsLoading ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-white/40 text-sm">Loading applications...</td></tr>
                ) : filteredApps.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-white/40 text-sm">No applications found</td></tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-white font-mono text-sm">#{app.id}</td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm font-medium">{app.fullName}</p>
                        <p className="text-white/40 text-xs">{app.nationality}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-white text-sm">{app.visaType}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-white/60 text-sm">{app.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[app.status] || statusColors.pending}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-xs font-medium ${paymentStatusColors[app.paymentStatus] || 'text-white/40'}`}>
                          {app.paymentMethod || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                          className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 transition-colors">
                          {selectedApp === app.id ? <ChevronDown size={14} /> : <Eye size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedApplication && (
          <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Application #{selectedApplication.id}</h3>
              <div className="flex items-center gap-2">
                <select value={selectedApplication.status} onChange={e => updateStatus.mutate({ id: selectedApplication.id, status: e.target.value })}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-gold focus:outline-none">
                  <option value="pending" className="bg-neutral-900">Pending</option>
                  <option value="processing" className="bg-neutral-900">Processing</option>
                  <option value="completed" className="bg-neutral-900">Completed</option>
                  <option value="rejected" className="bg-neutral-900">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gold font-medium text-sm mb-3">Personal Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Full Name</span><span className="text-white">{selectedApplication.fullName}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Nationality</span><span className="text-white">{selectedApplication.nationality}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Location</span><span className="text-white">{selectedApplication.currentLocation || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Phone</span><span className="text-white">{selectedApplication.phone}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Email</span><span className="text-white">{selectedApplication.email || 'N/A'}</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-gold font-medium text-sm mb-3">Visa & Payment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/40">Visa Type</span><span className="text-gold font-medium">{selectedApplication.visaType}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Travel Date</span><span className="text-white">{selectedApplication.travelDate || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Payment Method</span><span className="text-white">{selectedApplication.paymentMethod || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Payment Status</span><span className={`font-medium ${paymentStatusColors[selectedApplication.paymentStatus]}`}>{selectedApplication.paymentStatus}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Amount Paid</span><span className="text-white">{selectedApplication.amountPaid ? `AED ${(selectedApplication.amountPaid / 100).toLocaleString()}` : 'N/A'}</span></div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="mt-6">
              <h4 className="text-gold font-medium text-sm mb-3">Documents</h4>
              <div className="flex flex-wrap gap-3">
                {selectedApplication.passportUrl && (
                  <a href={selectedApplication.passportUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:border-gold/30 transition-colors">
                    <FileText size={16} className="text-gold" /> Passport Copy <ExternalLink size={12} className="text-white/40" />
                  </a>
                )}
                {selectedApplication.photoUrl && (
                  <a href={selectedApplication.photoUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:border-gold/30 transition-colors">
                    <FileText size={16} className="text-gold" /> Photo <ExternalLink size={12} className="text-white/40" />
                  </a>
                )}
                {selectedApplication.bankStatementUrl && (
                  <a href={selectedApplication.bankStatementUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:border-gold/30 transition-colors">
                    <FileText size={16} className="text-gold" /> Bank Statement <ExternalLink size={12} className="text-white/40" />
                  </a>
                )}
                {!selectedApplication.passportUrl && !selectedApplication.photoUrl && !selectedApplication.bankStatementUrl && (
                  <p className="text-white/30 text-sm">No documents uploaded</p>
                )}
              </div>
            </div>

            {selectedApplication.notes && (
              <div className="mt-6">
                <h4 className="text-gold font-medium text-sm mb-2">Notes</h4>
                <p className="text-white/60 text-sm">{selectedApplication.notes}</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <a href={`https://wa.me/${selectedApplication.phone?.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600/20 text-green-400 text-sm rounded-lg hover:bg-green-600/30 transition-colors">
                <MessageCircle size={16} /> Contact on WhatsApp
              </a>
              {selectedApplication.paymentMethod === 'Bank Transfer' && (
                <span className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-400 text-sm rounded-lg">
                  <Banknote size={16} /> Awaiting Transfer
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
