import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GridImage } from "../components/GridImage";
import { UnsplashCollectionDetails } from "../types";
import axios from "axios";

export const Collection:FC = () => {
    const [collection, setCollection] = useState<UnsplashCollectionDetails>()
    const navigate = useNavigate()
    const {id} = useParams()
    const fetchImages = async () => {
        try {
            const {data} = await axios.get<UnsplashCollectionDetails>(process.env.REACT_APP_API+'collection', {
                params: new URLSearchParams({
                    collection_id: id??''
                })
            })
            setCollection(data)
        } catch (error) {
            console.error(error)
            navigate('/collections')
        }
    }
    useEffect(() => {
        fetchImages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="py-8">
            {collection&&<div style={{backgroundImage: "url('/gradiend-bg@2x.png')"}} className="w-fit bg-[size:100%_100%] bg-center mx-auto bg-clip-text h-12 sm:h-20 max-w-full overflow-hidden">
                <h1 className="w-fit text-4xl sm:text-6xl font-bold text-transparent max-w-full overflow-hidden text-ellipsis">{collection.title}</h1>
            </div>}
            {collection&&<div className="mx-auto text-center w-full max-w-md text-wrap mt-2">
                {collection.total} {collection.total===1 ? 'photo' : 'photos'}
            </div>}
            {collection ? <main className="grid justify-center mt-8 items-center gap-4 grid-cols-[repeat(auto-fill,18rem)] auto-rows-[12rem] grid-flow-dense relative pb-16">
                {collection.photos.map((image,index) => <GridImage src={image.urls.small} id={image.id} key={image.id+index} width={image.width} height={image.height} alt={image.alt_description}/>)}
            </main> : <h1 className="text-center text-4xl font-bold animate-pulse">Loading...</h1>}
        </div>
    )
}

