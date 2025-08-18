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
            <div className="bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl border-2 border-teal-300 overflow-hidden">
                {/* Header */}
                <div className="border-b-2 border-lime-200 p-6">
                    <h2 className="text-3xl font-black text-teal-800 text-center mb-6">📝 Inscribe</h2>
                    
                    {/* Navigation Tabs */}
                    <div className="flex justify-center space-x-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`px-6 py-3 rounded-cartoon font-bold transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 shadow-cartoon border-2 border-lime-600'
                                        : 'text-teal-700 hover:text-teal-800 hover:bg-lime-100 border-2 border-transparent hover:border-lime-300'
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