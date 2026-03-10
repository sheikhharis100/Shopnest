import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch {
        setError('Failed to delete user');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>
      {loading ? <Loader /> : error ? <Message type="error">{error}</Message> : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Admin</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-xs text-gray-500">{user._id.slice(-6)}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {user.isAdmin ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Admin</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">User</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => deleteHandler(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;