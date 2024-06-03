import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const GridImage:FC<{src:string,id:string,alt?:string,width?:number,height?:number}> = ({src, alt='image', id, width, height}) => {
    const [ratio, setRatio] = useState<'book'|'video'|'normal'|null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const getRatio = (width:number, height:number) => {
        const ratio = Math.max(width,height)/Math.min(width,height)
        if(height > width) { // if book ratio
            if(ratio > 1.3) setRatio('book')
            else setRatio('normal')
        } else if (width > height) { // if video ratio (aspect should be more cuz visually horizontal layout much wider than vertical higher)
            if(ratio> 1.5) setRatio('video')
            else setRatio('normal')
        } else setRatio('normal')
    }
    useEffect(() => {
        const img = new Image()
        if(width&&height) getRatio(width,height)
        img.onload = () => {
            const height = img.naturalHeight
            const width = img.naturalWidth
            if(!ratio) getRatio(width,height)
            setLoading(false)
        }
        img.onerror = (error) => {
            setLoading(false)
            console.error(error)
        }
        img.alt = 'preload'
        img.src = src
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if(loading) return (
        <div className={`w-full h-full bg-secondaryGray flex flex-col rounded-md justify-center items-center shadow-sm animate-pulse ${ratio==='video' ? 'sm:col-span-2' : ratio==='book' ? 'row-span-2' : ''}`}>
            <div className="h-20 w-20 text-primaryGray overflow-hidden rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6 17h12l-3.75-5l-3 4L9 13zm-3 4V3h18v18z"></path></svg>
            </div>
        </div>
    )
    return (
        <Link to={`/images/${id}`} className={`w-full h-full rounded-md overflow-hidden hover:scale-105 hover:opacity-80 active:opacity-90 active:scale-100 transition-all bg-red-200 ${ratio==='video' ? 'sm:col-span-2' : ratio==='book' ? 'row-span-2' : ''}`}>
            <img alt={alt} className="w-full h-full object-cover" src={src} draggable={false}/>
        </Link>
    )
}