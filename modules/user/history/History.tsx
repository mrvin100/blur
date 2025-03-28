"use client";

import { useParties } from '@/hooks/useParties';
import { useRaces } from '@/hooks/useRaces';

export const History = () => {
  // Utilisation des hooks avec destructuring amélioré
  const { 
    getParties: { 
      data: parties, 
      refetch: refetchParties,
      isFetching: isFetchingParties,
      error: partiesError 
    } 
  } = useParties();

  const { 
    getRaces: { 
      data: races, 
      refetch: refetchRaces,
      isFetching: isFetchingRaces,
      error: racesError 
    } 
  } = useRaces();

  // Affichage conditionnel des erreurs
  if (partiesError || racesError) {
    return (
      <div className="p-4 text-red-500">
        Erreur: {partiesError?.message || racesError?.message}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-bold">Debug API</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => refetchParties()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isFetchingParties}
          >
            {isFetchingParties ? 'Chargement...' : 'Rafraîchir Parties'}
          </button>

          <button
            onClick={() => refetchRaces()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isFetchingRaces}
          >
            {isFetchingRaces ? 'Chargement...' : 'Rafraîchir Races'}
          </button>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Statut des requêtes :</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            Parties: {isFetchingParties ? 'Chargement...' : parties ? 'Prêtes' : 'Erreur'}{'\n'}
            Races: {isFetchingRaces ? 'Chargement...' : races ? 'Prêtes' : 'Erreur'}
          </pre>
        </div>
      </div>

      {/* Affichage conditionnel des données */}
      {!isFetchingParties && !isFetchingRaces && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Structure des données :</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-blue-600 mb-2">Parties</h4>
              <pre className="text-xs overflow-auto max-h-40">
                {JSON.stringify(parties?.[0] || {}, null, 2)}
              </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-green-600 mb-2">Races</h4>
              <pre className="text-xs overflow-auto max-h-40">
                {JSON.stringify(races?.[0] || {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};