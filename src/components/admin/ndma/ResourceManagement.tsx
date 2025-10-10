import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Resource } from '../../../types';
import { PlusCircle, Edit, Trash2, Truck } from 'lucide-react';
import Modal from '../../common/Modal';
import { adminUsers } from '../../../data/mockData';

type ResourceFormData = Omit<Resource, 'id' | 'available'>;

interface ResourceManagementProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ resources, setResources }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<ResourceFormData>();

  const openModalForEdit = (resource: Resource) => {
    setEditingResource(resource);
    setValue('type', resource.type);
    setValue('quantity', resource.quantity);
    setValue('location', resource.location);
    setValue('status', resource.status);
    setValue('assignedSdm', resource.assignedSdm);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingResource(null);
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
    reset();
  };

  const onSubmit = (data: ResourceFormData) => {
    const submittedData = { ...data, quantity: Number(data.quantity) };
    if (editingResource) {
      const updatedResource: Resource = { ...editingResource, ...submittedData, available: editingResource.available > submittedData.quantity ? submittedData.quantity : editingResource.available };
      setResources(resources.map(r => r.id === editingResource.id ? updatedResource : r));
    } else {
      const newResource: Resource = {
        id: `R${Date.now()}`,
        available: submittedData.quantity,
        ...submittedData,
      };
      setResources([...resources, newResource]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
        <button onClick={openModalForNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" /> Add Resource
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Available</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Assigned SDMA</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 capitalize flex items-center"><Truck className="w-4 h-4 mr-2" /> {r.type}</td>
                  <td className="px-6 py-4">{r.quantity}</td>
                  <td className="px-6 py-4">{r.available}</td>
                  <td className="px-6 py-4">{r.location}</td>
                  <td className="px-6 py-4">{r.assignedSdm || 'Unassigned'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModalForEdit(r)} className="p-2 text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingResource ? 'Edit Resource' : 'Add New Resource'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <select {...register('type')} className="w-full p-3 border rounded-lg bg-white">
            <option value="boat">Boat</option>
            <option value="jacket">Life Jacket</option>
            <option value="ambulance">Ambulance</option>
            <option value="medicine">Medicine Kit</option>
            <option value="food">Food Package</option>
            <option value="shelter">Temporary Shelter</option>
          </select>
          <input {...register('quantity')} type="number" placeholder="Total Quantity" className="w-full p-3 border rounded-lg" required />
          <input {...register('location')} placeholder="Base Location" className="w-full p-3 border rounded-lg" required />
          <select {...register('status')} className="w-full p-3 border rounded-lg bg-white">
            <option value="available">Available</option>
            <option value="deployed">Deployed</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select {...register('assignedSdm')} className="w-full p-3 border rounded-lg bg-white">
            <option value="">Unassigned</option>
            {adminUsers.filter(u => u.adminLevel === 'SDMA').map(sdm => <option key={sdm.id} value={sdm.id}>{sdm.name}</option>)}
          </select>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editingResource ? 'Save Changes' : 'Add Resource'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceManagement;
