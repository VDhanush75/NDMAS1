import React from 'react';
import { SdmReport, ResourceRequest, SOSRequest } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Truck, AlertTriangle, CheckCircle, XCircle, Inbox } from 'lucide-react';

interface UpdatesFeedProps {
    sdmReports: SdmReport[];
    resourceRequests: ResourceRequest[];
    sosRequests: SOSRequest[];
    onUpdateRequestStatus: (id: string, status: 'Approved' | 'Rejected') => void;
}

const UpdatesFeed: React.FC<UpdatesFeedProps> = ({ sdmReports, resourceRequests, sosRequests, onUpdateRequestStatus }) => {
    
    const combinedFeed = [
        ...sdmReports.map(report => ({
            type: 'SdmReport',
            id: report.id,
            timestamp: new Date(report.timestamp),
            title: report.title,
            content: report.content,
            source: report.submittedByName,
            category: report.category,
        })),
        ...resourceRequests.map(req => ({
            type: 'ResourceRequest',
            id: req.id,
            timestamp: new Date(req.timestamp),
            title: `Resource Request from ${req.requesterName}`,
            content: `${req.quantity} x ${req.resourceType} - Justification: ${req.justification}`,
            source: req.requesterName,
            category: 'Resource Request',
            status: req.status
        })),
        ...sosRequests.filter(sos => sos.status === 'pending').map(sos => ({
            type: 'SOSRequest',
            id: sos.id,
            timestamp: new Date(sos.timestamp),
            title: `New SOS Request from ${sos.userName}`,
            content: sos.description,
            source: `${sos.district}, ${sos.state}`,
            category: 'SOS',
        }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const getIcon = (category: string) => {
        switch (category) {
            case 'Work Update':
                return <FileText className="w-5 h-5 text-blue-500" />;
            case 'Resource Request':
                return <Truck className="w-5 h-5 text-orange-500" />;
            case 'SOS':
                 return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Updates Feed</h2>
                <p className="text-gray-600">Live feed of reports and requests from subordinate authorities.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flow-root">
                    <ul role="list" className="-mb-8">
                        {combinedFeed.length > 0 ? combinedFeed.map((item, itemIdx) => (
                            <li key={item.id}>
                                <div className="relative pb-8">
                                    {itemIdx !== combinedFeed.length - 1 ? (
                                        <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex items-start space-x-4">
                                        <div>
                                            <span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                                {getIcon(item.category)}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div>
                                                <div className="text-sm">
                                                    <p className="font-medium text-gray-900">{item.title}</p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500">
                                                    From {item.source} • {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-700">
                                                <p>{item.content}</p>
                                            </div>
                                            {item.type === 'ResourceRequest' && item.status === 'Pending' && (
                                                <div className="mt-3 flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => onUpdateRequestStatus(item.id, 'Approved')}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                                        <CheckCircle className="-ml-0.5 mr-2 h-4 w-4" />
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => onUpdateRequestStatus(item.id, 'Rejected')}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                        <XCircle className="-ml-0.5 mr-2 h-4 w-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            <div className="text-center py-10">
                                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No updates</h3>
                                <p className="mt-1 text-sm text-gray-500">New reports and requests will appear here.</p>
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UpdatesFeed;
