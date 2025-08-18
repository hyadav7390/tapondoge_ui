import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTools, 
    faRocket, 
    faLightbulb, 
    faTimes,
    faCode,
    faCog
} from '@fortawesome/free-solid-svg-icons';

export default function DevelopmentPopup({ isOpen, onClose, featureName }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />
            
            {/* Popup */}
            <div className={`relative bg-white/95 backdrop-blur-md rounded-cartoon shadow-cartoon-xl max-w-md w-full mx-4 transform transition-all duration-300 border-2 border-teal-300 ${
                isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-lime-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-lime-400 to-lime-500 rounded-cartoon shadow-cartoon-soft border-2 border-lime-600">
                            <FontAwesomeIcon icon={faTools} className="w-5 h-5 text-teal-900" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-teal-800">Under Development</h3>
                            <p className="text-sm text-teal-600 font-medium">{featureName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-teal-600 hover:text-teal-800 hover:bg-lime-100 rounded-cartoon transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-lime-400 to-lime-500 rounded-cartoon flex items-center justify-center mx-auto mb-4 shadow-cartoon-soft border-2 border-lime-600">
                            <FontAwesomeIcon icon={faRocket} className="w-8 h-8 text-teal-900" />
                        </div>
                        <h4 className="text-2xl font-black text-teal-800 mb-2">Coming Soon!</h4>
                        <p className="text-teal-600 font-medium">
                            We are working hard to bring you this amazing feature. Our development team is putting the finishing touches to ensure the best user experience.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-teal-900 font-bold rounded-cartoon shadow-cartoon hover:shadow-cartoon-lg hover:scale-105 active:scale-95 transition-all duration-200 transform"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 