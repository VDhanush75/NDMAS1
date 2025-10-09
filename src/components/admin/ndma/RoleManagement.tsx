import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, NgoData } from '../../../types';
import { indianStates } from '../../../data/locations';
import { PlusCircle, Edit, Trash2, UserCog, ShieldCheck, Handshake } from 'lucide-react';
import Modal from '../../common/Modal';

interface RoleManagementProps {
    adminUsers: User[];
    setAdminUsers: React.Dispatch<React.SetStateAction<User[]>>;
    rescueUsers: User[];
    setRescueUsers: React.Dispatch<React.SetStateAction<User[]>>;
    ngoData: NgoData[];
    setNgoData: React.Dispatch<React.SetStateAction<NgoData[]>>;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ adminUsers, setAdminUsers, rescueUsers, setRescueUsers, ngoData, setNgoData }) => {
  const [activeTab, setActiveTab] = useState('admin');
  
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [isNgoModalOpen, setNgoModalOpen] = useState(false);
  const [editingNgo, setEditingNgo] = useState<NgoData | null>(null);

  const { register: registerUser, handleSubmit: handleUserSubmit, reset: resetUser, setValue: setUserValue, watch: watchUserRole } = useForm<User>();
  const { register: registerNgo, handleSubmit: handleNgoSubmit, reset: resetNgo, setValue: setNgoValue, watch: watchNgoState } = useForm<NgoData>();

  const selectedUserRole = watchUserRole('role');
  const selectedNgoState = watchNgoState('state');

  // User Management (Admin & Rescue)
  const openUserModal = (user: User | null, role: 'admin' | 'rescue') => {
    setEditingUser(user);
    if (user) {
        setUserValue('name', user.name);
        setUserValue('email', user.email);
        setUserValue('role', user.role);
        setUserValue('serviceId', user.serviceId);
        if (role === 'admin') setUserValue('adminLevel', user.adminLevel);
        if (role === 'rescue') setUserValue('rescueLevel', user.rescueLevel);
        setUserValue('state', user.state);
        setUserValue('district', user.district);
    } else {
        resetUser({ role });
    }
    setUserModalOpen(true);
  };

  const onUserSubmit = (data: User) => {
    const userListSetter = data.role === 'admin' ? setAdminUsers : setRescueUsers;
    
    if (editingUser) {
        userListSetter(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, ...data, password: editingUser.password } : u));
    } else {
        userListSetter(prev => [...prev, { ...data, id: `${data.role}-${Date.now()}`, password: 'password123', permissions: { location: true, sms: true, notifications: true }, language: 'english' }]);
    }
    setUserModalOpen(false);
  };

  const deleteUser = (id: string, role: 'admin' | 'rescue') => {
    const userListSetter = role === 'admin' ? setAdminUsers : setRescueUsers;
    if (window.confirm(`Delete this ${role} user?`)) {
        userListSetter(prev => prev.filter(u => u.id !== id));
    }
  };

  // NGO Management
  const openNgoModal = (ngo: NgoData | null) => {
    setEditingNgo(ngo);
    if (ngo) {
        setNgoValue('name', ngo.name);
        setNgoValue('registrationId', ngo.registrationId);
        setNgoValue('state', ngo.state);
        setNgoValue('status', ngo.status);
        setNgoValue('assignedDistrict', ngo.assignedDistrict);
    } else {
        resetNgo({ status: 'Pending' });
    }
    setNgoModalOpen(true);
  };
  
  const onNgoSubmit = (data: NgoData) => {
    if (editingNgo) {
        setNgoData(ngoData.map(n => n.id === editingNgo.id ? { ...editingNgo, ...data } : n));
    } else {
        setNgoData([...ngoData, { ...data, id: `NGO-${Date.now()}` }]);
    }
    setNgoModalOpen(false);
  };
  
  const deleteNgo = (id: string) => {
      if(window.confirm('Delete this NGO record?')) {
          setNgoData(ngoData.filter(n => n.id !== id));
      }
  }

  return (
    <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
        <div className="flex border-b">
            <button onClick={() => setActiveTab('admin')} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${activeTab === 'admin' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}><UserCog /><span>Admin Roles</span></button>
            <button onClick={() => setActiveTab('rescue')} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${activeTab === 'rescue' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}><ShieldCheck /><span>Rescue Teams</span></button>
            <button onClick={() => setActiveTab('ngo')} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium ${activeTab === 'ngo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}><Handshake /><span>NGOs</span></button>
        </div>

      {activeTab === 'admin' && (
        <div>
            <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Admin Users</h3>
            <button onClick={() => openUserModal(null, 'admin')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
                <PlusCircle className="w-5 h-5 mr-2" /> Add Admin
            </button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Level</th><th className="px-6 py-3">Jurisdiction</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                <tbody>
                {adminUsers.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{u.name}</td>
                    <td className="px-6 py-4">{u.adminLevel}</td>
                    <td className="px-6 py-4">{u.district ? `${u.district}, ${u.state}` : u.state || 'National'}</td>
                    <td className="px-6 py-4 text-right"><button onClick={() => openUserModal(u, 'admin')} className="p-2 text-blue-600"><Edit size={16}/></button><button onClick={() => deleteUser(u.id, 'admin')} className="p-2 text-red-600"><Trash2 size={16}/></button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {activeTab === 'rescue' && (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Rescue Teams</h3>
                <button onClick={() => openUserModal(null, 'rescue')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
                    <PlusCircle className="w-5 h-5 mr-2" /> Add Rescue Team
                </button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th className="px-6 py-3">Team Name</th><th className="px-6 py-3">Level</th><th className="px-6 py-3">Jurisdiction</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                    <tbody>
                    {rescueUsers.map(u => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{u.name}</td>
                        <td className="px-6 py-4">{u.rescueLevel}</td>
                        <td className="px-6 py-4">{u.district}, {u.state}</td>
                        <td className="px-6 py-4 text-right"><button onClick={() => openUserModal(u, 'rescue')} className="p-2 text-blue-600"><Edit size={16}/></button><button onClick={() => deleteUser(u.id, 'rescue')} className="p-2 text-red-600"><Trash2 size={16}/></button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'ngo' && (
        <div>
            <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">NGO Management</h3>
            <button onClick={() => openNgoModal(null)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center transition-colors">
                <PlusCircle className="w-5 h-5 mr-2" /> Add NGO
            </button>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-lg overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th className="px-6 py-3">NGO Name</th><th className="px-6 py-3">Reg. ID</th><th className="px-6 py-3">State</th><th className="px-6 py-3">Assigned District</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                <tbody>
                {ngoData.map(n => (
                    <tr key={n.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{n.name}</td>
                    <td className="px-6 py-4">{n.registrationId}</td>
                    <td className="px-6 py-4">{n.state}</td>
                    <td className="px-6 py-4">{n.assignedDistrict || 'N/A'}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${n.status === 'Approved' ? 'bg-green-100 text-green-800' : n.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{n.status}</span></td>
                    <td className="px-6 py-4 text-right"><button onClick={() => openNgoModal(n)} className="p-2 text-blue-600"><Edit size={16}/></button><button onClick={() => deleteNgo(n.id)} className="p-2 text-red-600"><Trash2 size={16}/></button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      )}

      {/* User Modal (Admin & Rescue) */}
      <Modal isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)} title={editingUser ? `Edit ${editingUser.role}` : 'Add User'}>
        <form onSubmit={handleUserSubmit(onUserSubmit)} className="space-y-4">
            <input {...registerUser('name')} placeholder="Full Name / Team Name" className="w-full p-3 border rounded-lg" required />
            <input {...registerUser('email')} type="email" placeholder="Email" className="w-full p-3 border rounded-lg" required />
            <input {...registerUser('serviceId')} placeholder="Service ID" className="w-full p-3 border rounded-lg" required />
            
            {selectedUserRole === 'admin' && (
                <select {...registerUser('adminLevel')} className="w-full p-3 border rounded-lg bg-white" required>
                    <option value="">Select Admin Level</option>
                    <option value="SDMA">SDMA</option>
                    <option value="DDMA">DDMA</option>
                </select>
            )}
            {selectedUserRole === 'rescue' && (
                <select {...registerUser('rescueLevel')} className="w-full p-3 border rounded-lg bg-white" required>
                    <option value="">Select Rescue Role</option>
                    <option value="team-leader">Team Leader</option>
                    <option value="field-officer">Field Officer</option>
                </select>
            )}

            <select {...registerUser('state')} className="w-full p-3 border rounded-lg bg-white">
                <option value="">Select State</option>
                {Object.keys(indianStates).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input {...registerUser('district')} placeholder="District (for DDMA/Rescue)" className="w-full p-3 border rounded-lg" />
            
            <div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={() => setUserModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button></div>
        </form>
      </Modal>

      {/* NGO Modal */}
      <Modal isOpen={isNgoModalOpen} onClose={() => setNgoModalOpen(false)} title={editingNgo ? 'Edit NGO' : 'Add NGO'}>
        <form onSubmit={handleNgoSubmit(onNgoSubmit)} className="space-y-4">
            <input {...registerNgo('name')} placeholder="NGO Name" className="w-full p-3 border rounded-lg" required />
            <input {...registerNgo('registrationId')} placeholder="Registration ID" className="w-full p-3 border rounded-lg" required />
            <select {...registerNgo('state')} className="w-full p-3 border rounded-lg bg-white" required>
                <option value="">Select State</option>
                {Object.keys(indianStates).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select {...registerNgo('assignedDistrict')} className="w-full p-3 border rounded-lg bg-white" disabled={!selectedNgoState}>
              <option value="">Assign to District (Optional)</option>
              {selectedNgoState && indianStates[selectedNgoState]?.map(district => <option key={district} value={district}>{district}</option>)}
            </select>
            <select {...registerNgo('status')} className="w-full p-3 border rounded-lg bg-white" required>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setNgoModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoleManagement;
