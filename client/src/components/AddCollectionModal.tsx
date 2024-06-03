import { FC, useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { RowCollection } from "./RowCollection";
import { UnsplashCollection, UnsplashImage } from "../types";
import axios from "axios";

type EmitFunction = (collection:UnsplashCollection<string>) => void

export const AddCollectionModal:FC<{close:Function; photo: UnsplashImage; emit:EmitFunction}> = ({close, photo, emit}) => {
    const [collections, setCollections] = useState<UnsplashCollection<string>[]>()
    const [query, setQuery] = useState<string>()
    const fetchCollections = async () => {
        setCollections(undefined)
        try {
            const {data} = await axios.get(process.env.REACT_APP_API+'addcollections', {
                params: new URLSearchParams({
                    photo_id: photo.id,
                    search: query??''
                })
            })
            setCollections(data)
        } catch (error) {
            console.error(error)
            alert('Error fetching collections')
        }
    }
    const addToCollection = async (collection:UnsplashCollection<string>) => {
        try {
            await axios.patch(process.env.REACT_APP_API+'collections', photo, {
                params: new URLSearchParams({
                    collection_id: collection.id
                })
            })
            setCollections(old => old?.filter(el => el.id!==collection.id))
            emit(collection)
        } catch (error) {
            console.error(error)
            alert('Error adding to collection')
        }
    }
    useEffect(() => {
        fetchCollections()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])
    return (
        <div onClick={() => close()} className="fixed flex flex-col items-center justify-center top-0 left-0 w-full h-full bg-black bg-opacity-40">
            <div onClick={e => e.stopPropagation()} className="flex flex-col w-full max-w-screen-sm max-h-[min(100%,40rem)] bg-white dark:bg-primaryBlack p-6 gap-6 rounded-md shadow-md">
                <div className="flex w-full justify-between">
                    <h1 className="text-xl font-bold">Add to Colletions</h1>
                    <button onClick={() => close()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"></path></svg>
                    </button>
                </div>
                <div className="flex justify-center">
                    <SearchBar type="collections" setSearch={setQuery}/>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto hidescrollbar">
                    {collections?<><span className="text-xs text-primaryGray dark:text-secondaryGray">{collections.length} {collections.length===1?'match':'matches'}</span>
                        {collections.map((collection,index) => <RowCollection id={collection.id} name={collection.title} total={collection.total} type="add" key={collection.id+index} src={collection.covers} action={async () => addToCollection(collection)}/>)}
                    </>:
                    <h1 className="text-center text-xl font-semibold animate-pulse">Loading...</h1>}
                </div>
            </div>
        </div>
    )
}
