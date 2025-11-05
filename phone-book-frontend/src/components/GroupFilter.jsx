import { useState, useEffect } from 'react';
import { groupAPI } from '../services/api';
import { Filter } from 'lucide-react';

const GroupFilter = ({ onFilterChange }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await groupAPI.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error('Error loading groups:', err);
    }
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    onFilterChange(groupId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filtrer par groupe :</span>
        </div>
        
        <select
          value={selectedGroup}
          onChange={(e) => handleGroupChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tous les groupes</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        
        {selectedGroup && (
          <button
            onClick={() => handleGroupChange('')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Effacer le filtre
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupFilter;