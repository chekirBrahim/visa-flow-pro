export default function DossiersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Dossiers</h1>
        <p className="text-sm text-gray-500">Liste complète des dossiers visa en cours de traitement</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">Karim Belhaj</td>
              <td className="px-6 py-4 text-sm text-gray-600">🇫🇷 France</td>
              <td className="px-6 py-4 text-sm text-gray-600">Touristique</td>
              <td className="px-6 py-4"><span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">RDV pris</span></td>
              <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:underline">Détails</button></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">Leila Gharbi</td>
              <td className="px-6 py-4 text-sm text-gray-600">🇫🇷 France</td>
              <td className="px-6 py-4 text-sm text-gray-600">Étudiant</td>
              <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">En cours</span></td>
              <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:underline">Détails</button></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">Ahmed Triki</td>
              <td className="px-6 py-4 text-sm text-gray-600">🇮🇹 Italie</td>
              <td className="px-6 py-4 text-sm text-gray-600">Touristique</td>
              <td className="px-6 py-4"><span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Accordé</span></td>
              <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:underline">Détails</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
