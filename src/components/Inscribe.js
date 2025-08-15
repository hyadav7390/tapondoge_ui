import { useState } from 'react';
import Mint from './Mint';
import Deploy from './Deploy';
import Transfer from './Transfer';

export default function Inscribe() {
    const [activeTab, setActiveTab] = useState('mint');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div className="container p-4" style={{ maxWidth: '70%' }}>
            <div className="card shadow rounded" style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <div className="card-header">
                    <ul className="nav nav-tabs mb-2 justify-content-center" 
                        id="inscribeTabs" 
                        role="tablist"
                        style={{ border: 'none' }}>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link rounded-pill ${activeTab === 'mint' ? 'active' : ''}`}
                                onClick={() => handleTabClick('mint')}
                                type="button"
                                style={{ border: 'none' }}
                            >
                                Mint
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link rounded-pill ${activeTab === 'deploy' ? 'active' : ''}`}
                                onClick={() => handleTabClick('deploy')}
                                type="button"
                                style={{ border: 'none' }}
                            >
                                Deploy
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link rounded-pill ${activeTab === 'transfer' ? 'active' : ''}`}
                                onClick={() => handleTabClick('transfer')}
                                type="button"
                                style={{ border: 'none' }}
                            >
                                Transfer
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-5">
                    <div className="tab-content" id="inscribeTabsContent">
                        <div
                            className={`tab-pane fade ${activeTab === 'mint' ? 'show active' : ''}`}
                            role="tabpanel"
                        >
                            <Mint></Mint>
                        </div>

                        <div
                            className={`tab-pane fade ${activeTab === 'deploy' ? 'show active' : ''}`}
                            role="tabpanel"
                        >
                            <Deploy></Deploy>
                        </div>

                        <div
                            className={`tab-pane fade ${activeTab === 'transfer' ? 'show active' : ''}`}
                            role="tabpanel"
                        >
                            <Transfer></Transfer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}