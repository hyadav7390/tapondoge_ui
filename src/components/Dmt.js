import { useEffect, useState } from 'react';
import { getDeployments } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';

export default function Dmt() {
    const [deployments, setDeployments] = useState([]);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        fetchDeployments(0, 500);
    }, []);

    // Fetch Deployments
    const fetchDeployments = async (offset, rowsPerPage) => {
        try {
            showLoader();
            const response = await getDeployments(offset, rowsPerPage);
            setDeployments(response.result);
            console.log('response', response);
        } catch (error) {
            console.error('Error fetching deployments:', error);
        } finally {
            hideLoader();
        }
    };

    const dmtTokens = deployments.filter(data => data.dmt === true);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">DMT Tokens</h2>
                <p className="text-gray-600 mt-1">Dogecoin Mining Tokens</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Token
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Block
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dmtTokens.length > 0 ? (
                                dmtTokens.map((data, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-gray-900">{data.tick}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-gray-900">{data.blck}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <p className="text-lg font-medium">No DMT tokens found</p>
                                            <p className="text-sm">DMT tokens will appear here when available</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}