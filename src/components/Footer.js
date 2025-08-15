export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/tapondoge.jpg"
                            alt="TAPONDOGE Logo"
                            className="h-8 w-auto rounded"
                        />
                        <p className="text-gray-600">
                            © {new Date().getFullYear()} TAPONDOGE. All rights reserved.
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <a 
                            href="#" 
                            className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm font-medium"
                        >
                            Privacy Policy
                        </a>
                        <a 
                            href="#" 
                            className="text-gray-600 hover:text-primary-600 transition-colors duration-200 text-sm font-medium"
                        >
                            Terms of Service
                        </a>
                        <div className="flex items-center space-x-4">
                            <a 
                                href="https://discord.com/invite/CHbTua4UZj" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                            >
                                <img src="/discord.png" alt="Discord" className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://x.com/tapondogehq" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                            >
                                <img src="/x.png" alt="Twitter" className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}