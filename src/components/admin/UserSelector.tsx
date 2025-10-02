'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/predictions';

interface UserSelectorProps {
  selectedUserId?: string;
  onUserSelect: (userId: string | null) => void;
}

export default function UserSelector({ selectedUserId, onUserSelect }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const selectedUser = users.find(user => user.id === selectedUserId);

  const handleUserClick = (userId: string) => {
    if (selectedUserId === userId) {
      onUserSelect(null); // Désélectionner
    } else {
      onUserSelect(userId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        👤 Utilisateur mentionné (optionnel)
      </label>
      
      {/* Bouton de sélection */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-left flex items-center gap-3 hover:bg-gray-700 transition-colors duration-200"
      >
        {selectedUser ? (
          <>
            {selectedUser.avatar_url ? (
              <img
                src={selectedUser.avatar_url}
                alt={selectedUser.username}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                {selectedUser.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-white font-dogelica">{selectedUser.username}</span>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-400">
              👤
            </div>
            <span className="text-gray-400 font-dogelica">Sélectionner un utilisateur...</span>
          </>
        )}
        <span className="ml-auto text-gray-400">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Liste déroulante */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2"></div>
              Chargement des utilisateurs...
            </div>
          ) : (
            <>
              {/* Option "Aucun utilisateur" */}
              <button
                type="button"
                onClick={() => handleUserClick('')}
                className="w-full p-3 text-left hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-400">
                  ❌
                </div>
                <span className="text-gray-400 font-dogelica">Aucun utilisateur</span>
              </button>
              
              {/* Liste des utilisateurs */}
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserClick(user.id)}
                  className={`w-full p-3 text-left hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3 ${
                    selectedUserId === user.id ? 'bg-yellow-500/10 border-l-4 border-yellow-500' : ''
                  }`}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white font-dogelica">{user.username}</span>
                    <span className="text-xs text-gray-400">#{user.discord_id.slice(-4)}</span>
                  </div>
                  {selectedUserId === user.id && (
                    <span className="ml-auto text-yellow-400">✓</span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
