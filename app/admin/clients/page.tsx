export default function ClientsPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-sm text-gray-500">Liste de tous les clients Turquoise Voyage</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Ajouter un client
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dossiers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ajouté le</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">Karim Belhaj</td>
              <td className="px-6 py-4 text-sm text-gray-600">karim@example.com</td>
              <td className="px-6 py-4 text-sm text-gray-600">+216-90-123-456</td>
              <td className="px-6 py-4 text-sm text-gray-600">1</td>
              <td className="px-6 py-4 text-sm text-gray-600">2026-05-15</td>
              <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:underline">Modifier</button></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">Leila Gharbi</td>
              <td className="px-6 py-4 text-sm text-gray-600">leila@example.com</td>
              <td className="px-6 py-4 text-sm text-gray-600">+216-95-654-321</td>
              <td className="px-6 py-4 text-sm text-gray-600">1</td>
              <td className="px-6 py-4 text-sm text-gray-600">2026-05-14</td>
              <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:underline">Modifier</button></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">Ahmed Triki</td>
              <td className="px-6 py-4 text-sm text-gray-600">ahmed@example.com</td>
              <td className="px-6 py-4 text-sm text-gray-600">+216-98-789-012</td>
              <td className="px-6 py-4 text-sm text-gray-600">1</td>
              <td className="px-6 py-4 text-sm text-gray-600">2026-05-13</td>
              <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:underline">Modifier</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
