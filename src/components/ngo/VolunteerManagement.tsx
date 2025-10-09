import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { ngoVolunteers as initialVolunteers } from '../../data/mockData';
import { NgoVolunteer } from '../../types';
import Modal from '../common/Modal';

type VolunteerFormData = Omit<NgoVolunteer, 'id'>;

const VolunteerManagement: React.FC = () => {
  const [volunteers, setVolunteers] = useState<NgoVolunteer[]>(initialVolunteers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<NgoVolunteer | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<VolunteerFormData>();

  const openModalForEdit = (volunteer: NgoVolunteer) => {
    setEditingVolunteer(volunteer);
    setValue('name', volunteer.name);
    setValue('volunteerId', volunteer.volunteerId);
    setValue('email', volunteer.email);
    setValue('phone', volunteer.phone);
    setValue('status', volunteer.status);
    setValue('assignedZone', volunteer.assignedZone);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingVolunteer(null);
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVolunteer(null);
    reset();
  };

  const onSubmit = (data: VolunteerFormData) => {
    if (editingVolunteer) {
      setVolunteers(volunteers.map(v => v.id === editingVolunteer.id ? { ...data, id: v.id } : v));
    } else {
      setVolunteers([...volunteers, { ...data, id: `VOL${Date.now()}` }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      setVolunteers(volunteers.filter(v => v.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Volunteer Management</h2>
        <button onClick={openModalForNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" /> Add Volunteer
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 rounded-t-lg">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Volunteer ID</th>
                <th scope="col" className="px-6 py-3">Contact</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Assigned Zone</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(v => (
                <tr key={v.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{v.name}</td>
                  <td className="px-6 py-4">{v.volunteerId}</td>
                  <td className="px-6 py-4">{v.email}<br/>{v.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{v.assignedZone}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModalForEdit(v)} className="p-2 text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(v.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingVolunteer ? 'Edit Volunteer' : 'Add New Volunteer'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('name')} placeholder="Full Name" className="w-full p-2 border rounded" required />
          <input {...register('volunteerId')} placeholder="Volunteer ID" className="w-full p-2 border rounded" required />
          <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 border rounded" required />
          <input {...register('phone')} placeholder="Phone Number" className="w-full p-2 border rounded" required />
          <select {...register('status')} className="w-full p-2 border rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input {...register('assignedZone')} placeholder="Assigned Zone" className="w-full p-2 border rounded" />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editingVolunteer ? 'Save Changes' : 'Add Volunteer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VolunteerManagement;
