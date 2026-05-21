export default function CalendrierPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendrier des RDV</h1>
        <p className="text-sm text-gray-500">Planning des rendez-vous pour cette semaine</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {[
          ['Lundi 24 mai', '3', 'text-blue-600'],
          ['Mardi 25 mai', '2', 'text-green-600'],
          ['Mercredi 26 mai', '4', 'text-purple-600'],
          ['Jeudi 27 mai', '1', 'text-orange-600']
        ].map(([jour, count, color]) => (
          <div key={jour} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">{jour}</p>
            <p className={`text-3xl font-bold ${color} mt-2`}>{count}</p>
            <p className="text-xs text-gray-500 mt-1">rendez-vous</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">RDV de cette semaine</h2>
        <div className="space-y-4">
          <div className="flex items-start border-l-4 border-blue-600 pl-4 py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Karim Belhaj - Visa France</p>
              <p className="text-xs text-gray-500">Lundi 24 mai à 10:30 - Bureau Tunis</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Confirmé</span>
          </div>
          <div className="flex items-start border-l-4 border-green-600 pl-4 py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Leila Gharbi - Visa France</p>
              <p className="text-xs text-gray-500">Mardi 25 mai à 14:00 - Bureau Tunis</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">En attente</span>
          </div>
          <div className="flex items-start border-l-4 border-purple-600 pl-4 py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Ahmed Triki - Visa Italie</p>
              <p className="text-xs text-gray-500">Mercredi 26 mai à 09:00 - Bureau Tunis</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Confirmé</span>
          </div>
        </div>
      </div>
    </div>
  )
}
