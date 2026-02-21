import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { BASE_URL } from '../utils/constant'
import { setCuisineFilter } from '../features/restaurantsSlice'

function Section1() {
    const [resList, setResList] = useState([])
    const dispatch = useDispatch()

    // load a small set and derive cuisine tiles
    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const resp = await fetch('/mock/restaurants.json')
                const json = await resp.json()
                if (!mounted) return
                setResList((json || []).slice(0, 50))
            } catch (e) {
                console.warn('Section1: failed to load mock thumbnails', e)
            }
        })()
        return () => { mounted = false }
    }, [])

    const carouselRef = useRef(null)
    const pauserRef = useRef(false)
    const isTouchingRef = useRef(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [btnHover, setBtnHover] = useState(false)

    // setup auto-scroll interval for the right carousel
    useEffect(() => {
        const el = carouselRef.current
        if (!el) return
        pauserRef.current = false
        isTouchingRef.current = false
        const step = Math.max(1, Math.floor((el.scrollWidth / (el.children.length || 1)) * 0.25))
        const id = setInterval(() => {
            if (pauserRef.current || isTouchingRef.current) return
            if (!el) return
            const max = el.scrollWidth - el.clientWidth
            if (el.scrollLeft >= max - 2) {
                el.scrollTo({ left: 0, behavior: 'smooth' })
            } else {
                el.scrollBy({ left: step, behavior: 'smooth' })
            }
        }, 2500)
        return () => { clearInterval(id) }
    }, [resList])

    return (
        <header className="w-full bg-gradient-to-r from-yellow-300 to-yellow-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">

                    {/* Left: hero text + search */}
                    <div className="space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Hungry? We got you covered</h1>
                        <p className="text-gray-700 text-sm sm:text-base">Discover hand-picked restaurants and the best dishes in your neighborhood.</p>

                        <div className="mt-2 bg-white rounded-xl shadow p-4">
                            {/* Thumbnails only — search and pill filters removed */}
                            {resList.length > 0 && (
                                <div className="mt-1 flex gap-3 overflow-x-auto no-scrollbar">
                                    {/* derive unique cuisines */}
                                    {(() => {
                                        const map = new Map()
                                        for (const r of resList) {
                                            const cuisines = r?.info?.cuisines || []
                                            const img = r?.info?.imageUrl
                                            for (const c of cuisines) {
                                                const key = String(c).trim()
                                                if (!map.has(key)) map.set(key, img)
                                            }
                                            if (map.size >= 12) break
                                        }
                                        return Array.from(map.entries()).map(([cuisine, img]) => (
                                            <button
                                                key={cuisine}
                                                onClick={() => dispatch(setCuisineFilter(cuisine))}
                                                className="flex-shrink-0 w-20 h-14 rounded overflow-hidden shadow-sm relative"
                                            >
                                                <img src={img || '/mock/placeholder.jpg'} alt={cuisine} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                                                    <span className="text-xs text-white font-semibold">{cuisine}</span>
                                                </div>
                                            </button>
                                        ))
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: welcome card with friendly character */}
                    <div className="flex justify-center lg:justify-end">
                        <div
                            className="w-full max-w-md bg-white rounded-2xl ring-1 ring-yellow-50 overflow-hidden flex items-center gap-4 p-6"
                            style={{ boxShadow: '0 30px 60px rgba(194,65,12,0.28), 0 20px 40px rgba(249,115,22,0.18), 0 6px 12px rgba(249,115,22,0.06)' }}
                        >
                                <div className="flex-shrink-0 w-36 h-36 rounded-full bg-yellow-100 flex items-center justify-center shadow-inner">
                                {/* Replaced inline SVG with a creative avatar image (darker shadow) */}
                                <img
                                    src="/assets/creative-avatar.svg"
                                    alt="Savora avatar"
                                    className="w-28 h-28 object-contain"
                                    style={{ boxShadow: '0 14px 36px rgba(194,65,12,0.36)' }}
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">Welcome to Savora!</h3>
                                <p className="text-sm text-gray-600 mt-1">Explore curated restaurants and delicious dishes handpicked for you.</p>

                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            if (location.pathname === '/home') {
                                                const el = document.getElementById('restaurants')
                                                if (el) {
                                                    el.scrollIntoView({ behavior: 'smooth' })
                                                    return
                                                }
                                            }
                                            navigate('/home#restaurants')
                                        }}
                                        onMouseEnter={() => setBtnHover(true)}
                                        onMouseLeave={() => setBtnHover(false)}
                                        className="bg-yellow-400 text-gray-900 px-4 py-3 rounded-lg font-semibold w-full text-center transition-all"
                                        style={{
                                            cursor: 'pointer',
                                            boxShadow: btnHover ? '0 12px 36px rgba(194,65,12,0.36)' : '0 6px 18px rgba(194,65,12,0.24)'
                                        }}
                                    >
                                        Explore
                                    </button>
                                </div>

                                {/* partner restaurants count removed per request */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Section1
