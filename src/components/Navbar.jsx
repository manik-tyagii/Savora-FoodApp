import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signOutCurrentUser } from '../features/authSlice'
import SavoraLogo from "../assets/savora-logo1.png"

import {
    Briefcase,
    HelpCircle,
    Search,
    ShoppingBagIcon,
    User,
    Menu,
    X
} from 'lucide-react'

function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const cartCount = useSelector(
        (state) => state.cart.items.length || 0
    )

    const handleLogout = async () => {
        await dispatch(signOutCurrentUser())
        navigate('/login')
    }

    return (
        <nav
            className="
                w-full
                bg-blue-600
                shadow-[0_10px_18px_rgba(64,64,64,0.22),0_4px_6px_rgba(64,64,64,0.12)]
            "
        >
            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Navbar */}
                <div className="flex items-center justify-between py-4">

                    {/* Logo */}
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center cursor-pointer group"
                    >
                        <img
                            src={SavoraLogo}
                            alt="Savora Logo"
                            className="h-9 sm:h-10 w-auto rounded-lg"
                        />

                        <div className="ml-2 sm:ml-3 flex flex-col leading-tight">
                            <span
                                className="
                                    text-[10px]
                                    sm:text-xs
                                    md:text-sm
                                    font-semibold
                                    uppercase
                                    tracking-[0.3em]
                                    text-white
                                "
                            >
                                The Taste you need
                            </span>

                            <span
                                className="
                                    mt-1
                                    h-[2px]
                                    w-6
                                    sm:w-8
                                    bg-white
                                "
                            ></span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8 text-white">

                        {/* Corporate */}
                        <div className="flex items-center cursor-pointer hover:text-blue-100 transition">
                            <Briefcase size={20} className="mr-1" />
                            <span>Savora Corporate</span>
                        </div>

                        {/* Search */}
                        <div className="flex items-center cursor-pointer hover:text-blue-100 transition">
                            <Search size={20} className="mr-1" />
                            <span>Search</span>
                        </div>

                        {/* Help */}
                        <div className="flex items-center cursor-pointer hover:text-blue-100 transition">
                            <HelpCircle size={20} className="mr-1" />
                            <span>Help</span>
                        </div>

                        {/* Sign In */}
                        <div className="flex items-center cursor-pointer hover:text-blue-100 transition">
                            <User size={20} className="mr-1" />
                            <span>Sign In</span>
                        </div>

                        {/* Cart */}
                        <div
                            className="flex items-center cursor-pointer hover:text-blue-100 transition"
                            onClick={() => navigate('/cart')}
                        >
                            <div className="relative">
                                <ShoppingBagIcon size={20} />

                                <span
                                    className="
                                        absolute
                                        -top-2
                                        -right-2
                                        bg-orange-500
                                        text-white
                                        rounded-full
                                        w-5
                                        h-5
                                        flex
                                        items-center
                                        justify-center
                                        text-xs
                                        font-bold
                                    "
                                >
                                    {cartCount}
                                </span>
                            </div>

                            <span className="ml-2">Bag</span>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="
                                bg-orange-500
                                text-white
                                px-5
                                py-2
                                rounded-2xl
                                hover:bg-orange-600
                                transition
                            "
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <X size={28} />
                        ) : (
                            <Menu size={28} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div
                        className="
                            lg:hidden
                            pb-6
                            space-y-4
                            text-white
                        "
                    >

                        {/* Corporate */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Briefcase size={20} />
                            <span>Savora Corporate</span>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Search size={20} />
                            <span>Search</span>
                        </div>

                        {/* Help */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <HelpCircle size={20} />
                            <span>Help</span>
                        </div>

                        {/* Sign In */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <User size={20} />
                            <span>Sign In</span>
                        </div>

                        {/* Bag */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate('/cart')}
                        >
                            <ShoppingBagIcon size={20} />
                            <span>Bag ({cartCount})</span>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="
                                w-full
                                bg-orange-500
                                text-white
                                py-3
                                rounded-2xl
                                hover:bg-orange-600
                                transition
                            "
                        >
                            Logout
                        </button>
                    </div>
                )}

            </div>
        </nav>
    )
}

export default Navbar
