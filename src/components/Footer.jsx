function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Top Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div>
                        <h2 className="text-2xl font-bold text-white">Savora</h2>
                        <p className="mt-3 text-sm leading-relaxed">
                            Bringing your favorite meals to your doorstep.
                            Fresh ingredients, fast delivery, and flavors you’ll love.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Explore</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-white cursor-pointer">Top Restaurants</li>
                            <li className="hover:text-white cursor-pointer">Offers & Deals</li>
                            <li className="hover:text-white cursor-pointer">New Arrivals</li>
                            <li className="hover:text-white cursor-pointer">Popular Cuisines</li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-white cursor-pointer">About Us</li>
                            <li className="hover:text-white cursor-pointer">Careers</li>
                            <li className="hover:text-white cursor-pointer">Contact</li>
                            <li className="hover:text-white cursor-pointer">Support</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Get in Touch</h3>
                        <p className="text-sm">📍 Bengaluru, India</p>
                        <p className="text-sm mt-2">✉ support@savora.com</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
                    <p>© {new Date().getFullYear()} Savora. Crafted with ❤️ for food lovers.</p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
