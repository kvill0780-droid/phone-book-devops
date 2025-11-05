import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contactAPI } from '../services/api';
import ContactCard from '../components/ContactCard';
import SearchBar from '../components/SearchBar';
import GroupFilter from '../components/GroupFilter';
import { Users, AlertCircle } from 'lucide-react';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredByGroup, setFilteredByGroup] = useState([]);
  const [isFilteringByGroup, setIsFilteringByGroup] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading: authLoading, user } = useAuth();

  useEffect(() => {
    // Only load contacts if user is authenticated and not loading
    if (!authLoading && isAuthenticated && user) {
      loadContacts();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated, redirect will happen via ProtectedRoute
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, user]);

  // Handle URL parameters for group filtering
  useEffect(() => {
    const groupId = searchParams.get('groupId');
    const groupName = searchParams.get('groupName');
    
    if (groupId && contacts.length > 0) {
      handleGroupFilter(groupId);
      if (groupName) {
        setInfoMessage(`Affichage des contacts du groupe "${decodeURIComponent(groupName)}"`);  
        // Clear message after 3 seconds
        setTimeout(() => setInfoMessage(''), 3000);
      }
    }
  }, [contacts, searchParams]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Chargement des contacts...');
      const response = await contactAPI.getAll();
      console.log('Réponse reçue:', response);
      console.log('Response.data:', response.data);
      console.log('Type de response.data:', typeof response.data);
      console.log('Est un tableau?', Array.isArray(response.data));
      
      // Le backend retourne directement un List<Contact>, Axios le met dans response.data
      if (Array.isArray(response.data)) {
        setContacts(response.data);
        console.log(`${response.data.length} contact(s) chargé(s)`);
      } else {
        // Si ce n'est pas un tableau, initialiser avec un tableau vide
        console.warn('La réponse n\'est pas un tableau:', response.data);
        setContacts([]);
        if (response.data) {
          console.warn('Données reçues mais non-tableau, conversion...');
          // Essayer de convertir si possible
          setContacts([response.data]);
        }
      }
    } catch (err) {
      console.error('Erreur détaillée lors du chargement des contacts:', err);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      console.error('Headers:', err.response?.headers);
      
      if (err.response?.status === 401) {
        // 401 errors are handled by the API interceptor, but we should still clear error
        setError('');
        // Don't set error message as redirect will happen
      } else if (err.code === 'ECONNABORTED') {
        // Request was aborted, likely due to navigation
        setError('');
      } else if (err.response?.status === 403) {
        setError('Accès refusé. Vérifiez vos permissions.');
      } else if (err.response?.status >= 500) {
        setError('Erreur serveur. Veuillez réessayer plus tard.');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Erreur lors du chargement des contacts';
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, searchType) => {
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      let response;
      
      switch (searchType) {
        case 'firstName':
          response = await contactAPI.searchByFirstName(query);
          break;
        case 'lastName':
          response = await contactAPI.searchByLastName(query);
          break;
        case 'phone':
          response = await contactAPI.searchByPhone(query);
          break;
        case 'group':
          // Recherche locale par nom de groupe
          const filteredByGroup = contacts.filter(contact => 
            contact.group && contact.group.name.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(filteredByGroup);
          return;
        default:
          response = await contactAPI.search(query);
      }
      
      setSearchResults(response.data);
    } catch (err) {
      setSearchResults([]);
      setError('Aucun contact trouvé');
    }
  };

  const handleEdit = (contact) => {
    navigate(`/contacts/edit/${contact.id}`);
  };

  const handleGroupFilter = (groupId) => {
    if (!groupId) {
      setFilteredByGroup([]);
      setIsFilteringByGroup(false);
      return;
    }

    const filtered = contacts.filter(contact => 
      contact.group && contact.group.id.toString() === groupId
    );
    setFilteredByGroup(filtered);
    setIsFilteringByGroup(true);
    
    // Reset search when filtering by group
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      try {
        await contactAPI.delete(contactId);
        await loadContacts();
        if (isSearching) {
          setSearchResults(prev => prev.filter(c => c.id !== contactId));
        }
      } catch (err) {
        setError('Erreur lors de la suppression du contact');
      }
    }
  };

  const displayedContacts = isSearching ? searchResults : 
                           isFilteringByGroup ? filteredByGroup : contacts;

  // Show loading while auth is initializing or contacts are loading
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Mes Contacts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez votre carnet d'adresses personnel
          </p>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />
      <GroupFilter onFilterChange={handleGroupFilter} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
      
      {infoMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          {infoMessage}
        </div>
      )}

      {displayedContacts.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {isSearching ? 'Aucun résultat' : 'Aucun contact'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isSearching 
              ? 'Essayez avec d\'autres termes de recherche'
              : 'Commencez par ajouter un nouveau contact'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;