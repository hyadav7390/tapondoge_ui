export default function Footer() {
    return (
        <footer className="bg-light py-4 mt-auto">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="mb-0 text-muted">
                            © {new Date().getFullYear()} TAPONDOGE. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <ul className="list-inline text-md-end mb-0">
                            <li className="list-inline-item">
                                <a href="#" className="text-muted text-decoration-none">Privacy Policy</a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="#" className="text-muted text-decoration-none">Terms of Service</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}