import { useEffect, useState } from 'react';
import { getDeployments } from '@/utils/service';
import { useLoader } from '@/contexts/LoaderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

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
                <h2 className="text-3xl font-black text-teal-800 mb-2">⛏️ DMT Tokens</h2>
                <p className="text-teal-600 font-medium">Dogecoin Mining Tokens</p>
            </div>

            {/* Table */}
            <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-lime-100 to-lime-200">
                            <tr>
                                <th className="px-6 py-4 text-center text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">
                                    <FontAwesomeIcon icon={faCoins} className="w-4 h-4 mr-2" />
                                    Token
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-black text-teal-800 uppercase tracking-wider border-b-2 border-lime-300">
                                    <FontAwesomeIcon icon={faLayerGroup} className="w-4 h-4 mr-2" />
                                    Block
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y-2 divide-lime-100">
                            {dmtTokens.length > 0 ? (
                                dmtTokens.map((data, index) => (
                                    <tr key={index} className="hover:bg-lime-50 transition-all duration-200 group">
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center shadow-cartoon-soft border-2 border-gold-600">
                                                    <FontAwesomeIcon icon={faCoins} className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-bold text-teal-800">{data.tick}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold text-teal-800">{data.blck}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-12 text-center">
                                        <div className="text-teal-600">
                                            <div className="text-4xl mb-4">⛏️</div>
                                            <p className="text-lg font-bold">No DMT tokens found</p>
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