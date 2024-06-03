import { FC, useContext } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";

export const Layout:FC = () => {
    const {theme, setTheme} = useContext(ThemeContext)
    const location = useLocation()
    return (
        <div className="h-screen w-full dark:bg-primaryBlack dark:text-white font-['Be_Vietnam_Pro'] flex flex-col">
            <nav className="w-full max-w-screen-xl m-auto h-fit py-2 bg-white dark:bg-primaryBlack shadow-sm border-b border-secondaryGray dark:border-primaryGray flex items-center justify-center px-[min(4rem,calc(15%-4rem))] flex-wrap gap-2">
                <div className="flex flex-grow-[99999999999] justify-center xs:justify-start">
                    <Link to='/'>
                        {theme==='dark' ? <img draggable={false} className="select-none" src="/LogoW.svg" alt="logo"/> :
                        <img draggable={false} className="select-none" src="/Logo.svg" alt="logo"/>}
                    </Link>
                </div>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <button onClick={() => {setTheme(theme==='dark'?'light':'dark')}} className="px-2">
                        {theme==='dark' ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21"></path></svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17q-2.075 0-3.537-1.463T7 12t1.463-3.537T12 7t3.538 1.463T17 12t-1.463 3.538T12 17m-7-4H1v-2h4zm18 0h-4v-2h4zM11 5V1h2v4zm0 18v-4h2v4zM6.4 7.75L3.875 5.325L5.3 3.85l2.4 2.5zm12.3 12.4l-2.425-2.525L17.6 16.25l2.525 2.425zM16.25 6.4l2.425-2.525L20.15 5.3l-2.5 2.4zM3.85 18.7l2.525-2.425L7.75 17.6l-2.425 2.525z"></path></svg>}
                    </button>
                    <NavLink to={'/'} className={({isActive}) => `py-2 px-6 font-medium text-base rounded-md ${isActive||location.pathname==='/search'?'bg-secondaryGray dark:bg-secondaryBlack':'text-primaryGray'}`}>
                        Home
                    </NavLink>
                    <NavLink to={'/collections'} className={({isActive}) => `py-2 px-6 font-medium text-base rounded-md ${isActive?'bg-secondaryGray dark:bg-secondaryBlack':'text-primaryGray'}`}>
                        Collections
                    </NavLink>
                </div>
            </nav>
            <div className="h-full overflow-y-auto" id="page-wrapper">
                <div className="h-full max-w-screen-xl m-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}