import { FC } from "react";
import { Link } from "react-router-dom";

export const GridCollection:FC<{src:string[];title:string;id:string;total?:number;}> = ({src, title, id, total=0}) => {
    return (
        <div className="w-full h-full flex flex-col">
            <Link to={'/collections/'+id} className="w-full h-4/5 hover:scale-105 hover:opacity-80 active:opacity-90 active:scale-100 transition-all">
                {src.length<1&&<div className="w-full h-full bg-secondaryGray dark:bg-secondaryBlack"/>}
                {src.length===1&&<img draggable={false} className="w-full h-full object-cover select-none" src={src[0]} alt={title + ' Collection'}/>}
                {src.length===2&&<div className="w-full h-full flex overflow-hidden">
                    <img draggable={false} className="h-full w-1/2 pr-1 object-cover select-none" src={src[0]} alt={title + ' Collection (img1)'}/>
                    <img draggable={false} className="h-full w-1/2 pl-1 object-cover select-none" src={src[1]} alt={title + ' Collection (img2)'}/>
                </div>}
                {src.length>=3&&<div className="w-full h-full flex overflow-hidden">
                    <img draggable={false} className="h-full w-1/2 pr-1 object-cover select-none" src={src[0]} alt={title + ' Collection (img1)'}/>
                    <div className="flex flex-col w-1/2 pl-1 h-full">
                        <img draggable={false} className="h-1/2 pb-1 w-full object-cover select-none" src={src[1]} alt={title + ' Collection (img2)'}/>
                        <img draggable={false} className="h-1/2 pt-1 w-full object-cover select-none" src={src[2]} alt={title + ' Collection (img3)'}/>
                    </div>
                </div>}
            </Link>
            <div>
                <h1 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{title}</h1>
                <h2>{total} {total===1?'photo':'photos'}</h2>
            </div>
        </div>
    )
}