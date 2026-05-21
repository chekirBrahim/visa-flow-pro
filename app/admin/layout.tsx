import Link from 'next/link'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/dossiers', label: 'Dossiers', icon: '📁' },
  { href: '/admin/clients', label: 'Clients', icon: '👥' },
  { href: '/admin/calendrier', label: 'Calendrier RDV', icon: '📅' },
  ]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
          <div className="flex min-h-screen">
                <aside className="w-52 bg-white border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-100">
                                  <span className="text-sm font-semibold text-blue-600">VisaFlow Pro</span>span>
                                  <p className="text-xs text-gray-400 mt-0.5">Turquoise Voyage</p>p>
                        </div>div>
                        <nav className="flex-1 p-3 space-y-1">
                          {NAV.map(n => (
                        <Link key={n.href} href={n.href}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                      <span>{n.icon}</span>span>{n.label}
                        </Link>Link>
                      ))}
                        </nav>nav>
                </aside>aside>
                                            <main className="flex-1 overflow-auto">{children}</main>main>
          </div>div>
        )
}</div>
