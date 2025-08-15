import { useState } from 'react';
import Mint from './Mint';
import Deploy from './Deploy';
import Transfer from './Transfer';

export default function Inscribe() {
    const [activeTab, setActiveTab] = useState('mint');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const tabs = [
        { id: 'mint', name: 'Mint', component: Mint },
        { id: 'deploy', name: 'Deploy', component: Deploy },
        { id: 'transfer', name: 'Transfer', component: Transfer }
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Inscribe</h2>
                    
                    {/* Navigation Tabs */}
                    <div className="flex justify-center space-x-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                                }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {ActiveComponent && <ActiveComponent />}
                </div>
            </div>
        </div>
    );
}