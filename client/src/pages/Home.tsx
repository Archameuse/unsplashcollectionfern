import { FC } from "react";
import { SearchBar } from "../components/SearchBar";

export const Home:FC = () => {
    return (
        <div className="h-full w-full flex">
            <div style={{backgroundImage: "url('/hero-left.png')"}} className="flex-grow bg-cover lg:bg-contain bg-right"></div>
            <div className="flex-grow-[9999999999] h-full max-w-screen-md flex flex-col justify-center pb-32 items-center px-2 gap-4">
                <h1 className="text-4xl font-semibold text-center dark:text-secondaryGray">Search</h1>
                <h2 className="text-center text-base font-light dark:text-primaryGray">Search high-resolution images from Unsplash</h2>
                <SearchBar />
            </div>
            <div style={{backgroundImage: "url('/hero-right.png')"}} className="flex-grow bg-cover lg:bg-contain bg-left"></div>
        </div>
    )
}