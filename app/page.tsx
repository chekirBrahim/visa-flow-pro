import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">VisaFlow Pro</div>
          <Link href="/admin/dossiers" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Accéder à l'Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Bienvenue sur VisaFlow Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          La plateforme complète de gestion de dossiers visa pour Turquoise Voyage
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des Dossiers</h3>
            <p className="text-gray-600">Suivi complet des demandes de visa en cours de traitement</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des Clients</h3>
            <p className="text-gray-600">Base de données centralisée de tous vos clients</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendrier RDV</h3>
            <p className="text-gray-600">Planification et gestion des rendez-vous visa</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16">
          <Link
            href="/admin/dossiers"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Aller au Tableau de Bord Admin
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p>Turquoise Voyage · VisaFlow Pro v1.0</p>
          <p className="text-gray-400 text-sm mt-2">Powered by Next.js & Supabase</p>
        </div>
      </footer>
    </div>
  );
}
