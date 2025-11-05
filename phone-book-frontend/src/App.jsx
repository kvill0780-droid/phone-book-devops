import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ContactList from './pages/ContactList';
import ContactForm from './pages/ContactForm';
import GroupList from './pages/GroupList';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<ContactList />} />
        <Route path="groups" element={<GroupList />} />
        <Route path="contacts/new" element={<ContactForm />} />
        <Route path="contacts/edit/:id" element={<ContactForm />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
