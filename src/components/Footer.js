export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                    {/* Logo and Copyright */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="/tapondoge.jpg"
                            alt="TAPONDOGE Logo"
                            className="h-8 w-8 rounded-lg"
                        />
                        <div className="text-center lg:text-left">
                            <p className="text-gray-800 font-semibold text-sm">TAPONDOGE</p>
                            <p className="text-xs text-gray-500">
                                © {new Date().getFullYear()} All rights reserved.
                            </p>
                        </div>
                    </div>

                    {/* Powered by Benny Protocol - Highlighted */}
                    <div className="flex flex-col items-center space-y-1 bg-gradient-to-r from-primary-50 to-blue-50 px-4 py-2 rounded-lg border border-primary-100">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600 font-medium">Powered by</span>
                            <a 
                                href="https://api.tapondoge.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors duration-200"
                            >
                                Benny Protocol
                            </a>
                        </div>
                        <a 
                            href="https://api.tapondoge.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-700 transition-colors duration-200 font-medium"
                        >
                            api.tapondoge.com
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-4">
                        <a 
                            href="https://discord.com/invite/CHbTua4UZj" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 group"
                        >
                            <img src="/discord.png" alt="Discord" className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-sm font-medium hidden sm:inline">Discord</span>
                        </a>
                        <a 
                            href="https://x.com/tapondogehq" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200 group"
                        >
                            <img src="/x.png" alt="Twitter" className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-sm font-medium hidden sm:inline">Twitter</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}