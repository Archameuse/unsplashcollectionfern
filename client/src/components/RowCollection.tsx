import { FC, useState } from "react";
import { Link } from "react-router-dom";

type AsyncFunction = (id?:string) => Promise<void>

export const RowCollection:FC<{src?:string;name:string;total?:number;id:string; type?:'add'|'remove'; action?: AsyncFunction;}> = ({src,name,total=0,id,type='remove',action}) => {
    const [loading,setLoading] = useState<boolean>(false)

    const emitAction = async () => {
        if(!action) return
        setLoading(true)
        await action(id)
        setLoading(false)
    }

    return (
        <div className="flex w-full hover:bg-secondaryGray dark:hover:bg-secondaryBlack rounded-md relative group">
            <Link to={'/collections/'+id} className="flex w-full p-2 gap-4">
                {src?<img alt={'Collection ' + name + ' Preview icon'} src={src} className="w-16 h-16 rounded-md object-cover"/>:
                <div className="w-16 h-16 rounded-md bg-secondaryGray dark:bg-secondaryBlack"/>}
                <div className="flex flex-col justify-center gap-2">
                    <h2 className="text-sm max-w-[25ch] text-ellipsis overflow-hidden">{name}</h2>
                    <span className="text-xs font-light">{total} {total===1?'photo':'photos'}</span>
                </div>
            </Link>
            {!loading?<button onClick={(e) => {e.stopPropagation();e.preventDefault();emitAction()}} className="absolute hidden gap-2 group-hover:flex items-center px-4 py-2 hover:bg-primaryGray active:opacity-80 right-4 top-1/2 -translate-y-1/2 capitalize rounded-md">
                <div className="w-4 h-4">
                    {type==='remove'?<img alt="Remove from collection icon" className="dark:invert" src="/Remove.svg"/>:
                    <img alt="Add to collection icon" className="dark:invert" src="/Plus.svg"/>}
                </div>
                {type}
            </button>:
            <button onClick={e => {e.stopPropagation();e.preventDefault()}} className="absolute gap-2 flex items-center px-4 py-2 opacity-80 right-4 top-1/2 -translate-y-1/2 capitalize rounded-md cursor-not-allowed">
                <div className="w-4 h-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"><path strokeDasharray="2 4" strokeDashoffset="6" d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"><animate attributeName="stroke-dashoffset" dur="0.6s" repeatCount="indefinite" values="6;0"></animate></path><path strokeDasharray="30" strokeDashoffset="30" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.3s" values="30;0"></animate></path><path strokeDasharray="10" strokeDashoffset="10" d="M12 16v-7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="10;0"></animate></path><path strokeDasharray="6" strokeDashoffset="6" d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="6;0"></animate></path></g></svg>
                </div>
                {type}
            </button>}
        </div>
    )
}