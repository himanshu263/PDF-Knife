import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { 
  Moon as MoonIcon, 
  Sun as SunIcon, 
  History as HistoryIcon, 
  Upload as UploadIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronDown as ChevronDownIcon,
  Home as HomeIcon, 
  Info as InfoIcon, 
  ArrowLeft as ArrowLeftIcon,
  LayoutGrid as LayoutGridIcon, 
  Settings as SettingsIcon,
  Github as GHIcon,
  Download,
  Terminal as TerminalIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  CheckCircle2 as CheckCircleIcon,
  Trash2 as Trash2Icon
} from 'lucide-react'

import { Theme, Tool, ToolCategory, ViewMode } from '../types'
import { PdfKnifeLogo } from './Logo'
import { ActivityEntry, getRecentActivity, clearActivity } from '../utils/recentActivity'
import { hapticImpact } from '../utils/haptics'

interface LayoutProps {
  children: React.ReactNode
  theme: Theme
  toggleTheme: () => void
  tools: Tool[]
  onFileDrop?: (files: FileList) => void
  viewMode?: ViewMode
}

export default function Layout({ children, theme, toggleTheme, tools, onFileDrop }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDragging, setIsDragging] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
  const quickMenuRef = useRef<HTMLDivElement>(null)
  
  const isHome = location.pathname === '/'
  
  useEffect(() => {
    if (showHistory) {
      getRecentActivity().then(setActivity)
    }
  }, [showHistory])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickMenuRef.current && !quickMenuRef.current.contains(e.target as Node)) {
        setIsQuickMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (onFileDrop) setIsDragging(true)
    }
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDragging(false)
      }
    }
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (onFileDrop && e.dataTransfer?.files) {
        onFileDrop(e.dataTransfer.files)
      }
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)
    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
    }
  }, [onFileDrop])

  const setTheme = (t: Theme) => {
    if (t !== theme) toggleTheme()
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-500`}>
      
      {isDragging && (
        <div className="fixed inset-0 z-[200] bg-blue-600/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] shadow-2xl border-4 border-dashed border-blue-600 animate-in zoom-in duration-300">
            <UploadIcon size={64} className="text-blue-600 animate-bounce" />
            <p className="mt-4 font-black uppercase tracking-widest text-blue-600 text-center text-sm">Drop PDF to start</p>
          </div>
        </div>
      )}

      {/* Modern Centered Header */}
      <header className="flex items-center justify-between px-4 md:px-8 h-20 border-b border-white/20 dark:border-white/10 glass sticky top-0 z-[100] transition-all duration-500">
        
        {/* Left: Navigation Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          {!isHome && (
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-500 hover:text-blue-600 shrink-0">
              <ArrowLeftIcon size={20} />
            </button>
          )}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/tools/merge-pdf" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Merge</Link>
            <Link to="/tools/compress-pdf" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Compress</Link>
            <Link to="/tools/protect-pdf" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Protect</Link>
          </div>
        </div>

        {/* Center: Logo Branding */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <PdfKnifeLogo size={42} />
            <span className="font-black tracking-tighter text-2xl dark:text-white hidden xs:block">PDF Knife</span>
          </Link>
        </div>

        {/* Right: Tools & Theme */}
        <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
          {/* Custom Theme Switcher (Apple Glass Style) */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-sm">
            <button 
              onClick={() => setTheme('light')} 
              className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <SunIcon size={14} strokeWidth={3} />
            </button>
            <button 
              onClick={() => setTheme('dark')} 
              className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-zinc-900 text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <MoonIcon size={14} strokeWidth={3} />
            </button>
          </div>

          <div className="relative" ref={quickMenuRef}>
            <button 
              onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 whitespace-nowrap"
            >
              <ZapIcon size={14} className="fill-current" />
              <span className="hidden md:inline">Quick Action</span>
              <ChevronDownIcon size={12} className={`transition-transform duration-300 ${isQuickMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isQuickMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 glass rounded-3xl p-3 shadow-2xl z-[200] animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 gap-1">
                   {[
                      { label: 'PDF to Image', icon: ImageIcon, path: '/tools/pdf-to-img', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
                      { label: 'Images to PDF', icon: FileTextIcon, path: '/tools/img-to-pdf', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                      { label: 'Split PDF', icon: LayoutGridIcon, path: '/tools/split-pdf', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
                      { label: 'Add Password', icon: ShieldIcon, path: '/tools/protect-pdf', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' }
                   ].map(item => (
                     <button 
                        key={item.path}
                        onClick={() => {
                          navigate(item.path)
                          setIsQuickMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group text-left"
                     >
                        <div className={`p-2 rounded-xl ${item.color} group-hover:bg-white/20 group-hover:text-white transition-colors`}>
                          <item.icon size={18} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
                     </button>
                   ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setShowHistory(true)} className={`p-2 transition-colors relative ${showHistory ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
            <HistoryIcon size={22} />
            {activity.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-black" />}
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        {children}
      </main>

      {/* Glass Footer */}
      <footer className="border-t border-white/20 dark:border-white/10 glass">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-12">
            <div className="col-span-2 md:col-span-6 space-y-6">
              <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-white group w-fit">
                <PdfKnifeLogo size={40} />
                <span className="font-black tracking-tighter text-2xl group-hover:text-blue-600 transition-colors">PDF Knife</span>
              </Link>
              <p className="text-gray-500 dark:text-zinc-500 text-sm leading-relaxed max-w-sm font-medium">
                The privacy-first PDF toolkit. 100% client-side logic. <br/>
                No uploads, no servers, just your data in your browser.
              </p>
              <div className="flex items-center gap-4">
                 <a href="https://github.com/himanshu263/PDF-Knife" target="_blank" className="p-3 glass rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-gray-500 dark:text-zinc-500 group">
                   <GHIcon size={18} className="group-hover:scale-110 transition-transform" />
                 </a>
                 <div className="px-4 py-2 glass rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Stable Engine</span>
                 </div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 mb-6">Internal</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-600 dark:text-zinc-400">
                <li><Link to="/about" className="hover:text-blue-600 transition-colors">Protocol Spec</Link></li>
                <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><a href="https://github.com/himanshu263/PDF-Knife/blob/main/LICENSE" target="_blank" className="hover:text-blue-600 transition-colors">License AGPLv3</a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-3">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-600 mb-6">Developer</h4>
              <ul className="space-y-4 text-xs font-bold text-gray-600 dark:text-zinc-400">
                <li><a href="https://himanshu263.github.io/resume/" target="_blank" className="hover:text-blue-600 transition-colors">Resume</a></li>
                <li><a href="https://github.com/himanshu263/PDF-Knife/issues" target="_blank" className="hover:text-blue-600 transition-colors">Report Issue</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 dark:text-zinc-600 font-black uppercase tracking-widest">
            <p>© 2026 PDF Knife Project • Local Engine</p>
            <a href="https://himanshu263.github.io/resume/" target="_blank" className="hover:text-blue-600 transition-colors">@himanshu263</a>
          </div>
        </div>
      </footer>

      {/* History Drawer */}
      <aside className={`fixed top-0 right-0 h-screen w-full sm:w-80 glass z-[150] shadow-2xl transition-transform duration-500 ease-out transform ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <HistoryIcon className="text-blue-600" size={24} />
              <h2 className="text-xl font-black dark:text-white tracking-tighter">Activity History</h2>
            </div>
            <div className="flex items-center gap-2">
              {activity.length > 0 && (
                <button 
                  onClick={async () => { await clearActivity(); setActivity([]); }}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 rounded-xl transition-colors"
                >
                  <Trash2Icon size={18} />
                </button>
              )}
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <ChevronRightIcon size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {activity.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                <HistoryIcon size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-[10px] font-black uppercase tracking-widest">No recent records</p>
              </div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="p-4 glass-card rounded-2xl group relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate dark:text-white">{item.name}</p>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">{item.tool}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold">
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    {item.resultUrl && (
                      <a href={item.resultUrl} download={item.name} className="text-blue-600 hover:underline flex items-center gap-1">
                        <DownloadIcon size={10} /> Get File
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
      {showHistory && (<div onClick={() => setShowHistory(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140] animate-in fade-in duration-300" />)}
    </div>
  )
}