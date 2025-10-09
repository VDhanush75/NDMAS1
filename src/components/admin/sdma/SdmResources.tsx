import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Resource, ResourceRequest } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { PlusCircle, Send, Package, Check, X, Clock } from 'lucide-react';
import Modal from '../../common/Modal';
import { format } from 'date-fns';

interface SdmResourcesProps {
    resources: Resource[];
    resourceRequests: ResourceRequest[];
    setResourceRequests: React.Dispatch<React.SetStateAction<ResourceRequest[]>>;
}

type RequestFormData = Omit<ResourceRequest, 'id' | 'status' | 'requestedBy' | 'requesterId' | 'requesterName' | 'timestamp'>;

const SdmResources: React.FC<SdmResourcesProps> = ({ resources, resourceRequests, setResourceRequests }) => {
    const { user } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<RequestFormData>();

    // Filter resources for the current SDMA's state
    const sdmaResources = resources.filter(r => r.assignedSdm === user?.id);
    const sdmaRequests = resourceRequests.filter(r => r.requesterId === user?.id);

    const total = sdmaResources.reduce((acc, r) => acc + r.quantity, 0);
    const available = sdmaResources.reduce((acc, r) => acc + r.available, 0);
    const deployed = total - available;

    const onSubmit = (data: RequestFormData) => {
        const newRequest: ResourceRequest = {
            id: `req-${Date.now()}`,
            status: 'Pending',
            requestedBy: 'SDMA',
            requesterId: user!.id,
            requesterName: user!.name,
            timestamp: new Date(),
            ...data,
            quantity: Number(data.quantity),
        };
        setResourceRequests(prev => [newRequest, ...prev]);
        setModalOpen(false);
        reset();
    };

    const getStatusIcon = (status: 'Pending' | 'Approved' | 'Rejected') => {
        switch (status) {
            case 'Pending': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Approved': return <Check className="w-5 h-5 text-green-500" />;
            case 'Rejected': return <X className="w-5 h-5 text-red-500" />;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">State Resource Overview ({user?.state})</h2>
                <p className="text-gray-600">Manage resources allocated to your state.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <p className="text-4xl font-bold text-gray-800">{total}</p>
                    <p className="text-sm text-gray-500">Total Resources</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <p className="text-4xl font-bold text-green-600">{available}</p>
                    <p className="text-sm text-gray-500">Available</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                    <p className="text-4xl font-bold text-orange-600">{deployed}</p>
                    <p className="text-sm text-gray-500">Deployed</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Resources</h3>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Resource</th>
                                    <th scope="col" className="px-4 py-3">Available / Total</th>
                                    <th scope="col" className="px-4 py-3">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sdmaResources.length > 0 ? sdmaResources.map(r => (
                                    <tr key={r.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900 capitalize">{r.type}</td>
                                        <td className="px-4 py-3">{r.available} / {r.quantity}</td>
                                        <td className="px-4 py-3">{r.location}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-gray-500">No resources assigned to this SDMA.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">My Requests to NDMA</h3>
                        <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center transition-colors">
                            <PlusCircle className="w-5 h-5 mr-2" /> New Request
                        </button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {sdmaRequests.length > 0 ? sdmaRequests.map(req => (
                            <div key={req.id} className="border-b pb-3">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium text-gray-800">{req.quantity} x <span className="capitalize">{req.resourceType}</span></p>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(req.status)}
                                        <span className={`text-sm font-semibold ${req.status === 'Pending' ? 'text-yellow-600' : req.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{req.status}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Requested on {format(new Date(req.timestamp), 'MMM d, yyyy')}</p>
                                <p className="text-sm text-gray-600 mt-1 italic">"{req.justification}"</p>
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No resource requests made.</p>}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Request New Resources from NDMA">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <select {...register('resourceType')} className="w-full p-3 border rounded-lg bg-white" required>
                        <option value="">Select Resource Type</option>
                        <option value="boat">Boat</option>
                        <option value="jacket">Life Jacket</option>
                        <option value="ambulance">Ambulance</option>
                        <option value="medicine">Medicine Kit</option>
                        <option value="food">Food Package</option>
                        <option value="shelter">Temporary Shelter</option>
                    </select>
                    <input {...register('quantity')} type="number" placeholder="Quantity Needed" className="w-full p-3 border rounded-lg" required />
                    <textarea {...register('justification')} placeholder="Justification for request..." rows={4} className="w-full p-3 border rounded-lg" required />
                    <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"><Send className="w-4 h-4 mr-2" />Send Request</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SdmResources;
