import { FC, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar:FC<{defaultValue?:string;type?:'images'|'collections';setSearch?:Function}> = ({defaultValue='',type='images',setSearch}) => {
    const navigate = useNavigate()
    const search = (e:KeyboardEvent<HTMLInputElement>) => {
        if(!(e.code==='Enter')) return
        if(type==='images') {
            if(!e.currentTarget.value) return
            if(e.currentTarget.value===defaultValue) return
            navigate(`/search?query=${e.currentTarget.value}`)
        } else if (type==='collections') {
            if(!setSearch) return
            setSearch(e.currentTarget.value)
        }
    }
    return (
        <label className="w-full max-w-xl h-14 bg-white dark:bg-secondaryBlack border border-secondaryGray dark:border-primaryGray rounded-md shadow-md p-2 flex items-center">
            <input defaultValue={defaultValue} onKeyUp={search} placeholder="Enter your keywords..." className="w-full h-full bg-white dark:bg-secondaryBlack placeholder:font-light text-sm focus:outline-none"></input>
            <img alt="search icon" src="/Search.svg" className="h-6 mx-2 dark:opacity-40"/>
        </label>
    )
}