import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { reliefGoods as initialGoods } from '../../data/mockData';
import { ReliefGood } from '../../types';
import Modal from '../common/Modal';

type GoodFormData = Omit<ReliefGood, 'id' | 'lastUpdated'>;

const InventoryManagement: React.FC = () => {
  const [goods, setGoods] = useState<ReliefGood[]>(initialGoods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGood, setEditingGood] = useState<ReliefGood | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<GoodFormData>();

  const openModalForEdit = (good: ReliefGood) => {
    setEditingGood(good);
    setValue('name', good.name);
    setValue('category', good.category);
    setValue('quantity', good.quantity);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingGood(null);
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGood(null);
    reset();
  };

  const onSubmit = (data: GoodFormData) => {
    const submittedData = { ...data, quantity: Number(data.quantity) };
    if (editingGood) {
      setGoods(goods.map(g => g.id === editingGood.id ? { ...submittedData, id: g.id, lastUpdated: new Date() } : g));
    } else {
      setGoods([...goods, { ...submittedData, id: `GOOD${Date.now()}`, lastUpdated: new Date() }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item from inventory?')) {
      setGoods(goods.filter(g => g.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Relief Inventory</h2>
        <button onClick={openModalForNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {goods.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-lg relative group">
            <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModalForEdit(item)} className="p-1.5 bg-gray-100 rounded-full text-blue-600 hover:bg-blue-100"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-gray-100 rounded-full text-red-600 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
            </div>
            <p className="text-xs font-semibold text-blue-600 uppercase">{item.category}</p>
            <h3 className="font-bold text-lg text-gray-800 mt-1">{item.name}</h3>
            <p className="text-4xl font-bold text-gray-900 my-2">{item.quantity.toLocaleString()}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(item.quantity / 1000) * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Updated: {item.lastUpdated.toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingGood ? 'Edit Inventory Item' : 'Add New Item'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('name')} placeholder="Item Name" className="w-full p-2 border rounded" required />
          <select {...register('category')} className="w-full p-2 border rounded">
            <option value="Food">Food</option>
            <option value="Medical">Medical</option>
            <option value="Shelter">Shelter</option>
            <option value="Equipment">Equipment</option>
            <option value="Other">Other</option>
          </select>
          <input {...register('quantity')} type="number" placeholder="Quantity" className="w-full p-2 border rounded" required />
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editingGood ? 'Save Changes' : 'Add Item'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManagement;
