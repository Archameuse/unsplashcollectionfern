import { FC, useEffect, useState } from "react";
import { GridCollection } from "../components/GridCollection";
import { UnsplashCollection } from "../types";
import axios from "axios";

export const Collections:FC = () => {
    const [collection, setCollections] = useState<UnsplashCollection<string[]>[]>()
    const fetchCollection = async () => {
        try {
            const {data} = await axios.get<UnsplashCollection<string[]>[]>(process.env.REACT_APP_API+'collections')
            setCollections(data)
        } catch (error) {
            console.error(error)
            alert('Error')
        }
    }
    const addCollection = async () => {
        const name = prompt('Enter a name for collection')
        if(!name) return
        if(name.length>30) return alert('Name for a collection should be shorter than 30 characters')
        // console.log(name)
        try {
            const {data} = await axios.post<UnsplashCollection<string[]>>(process.env.REACT_APP_API+'collections', {}, {
                params: new URLSearchParams({
                    name
                })
            })
            // console.log(data)
            setCollections(old => {
                if(!old) return old
                return [
                    data,
                    ...old
                ]
            })
        } catch (error) {
            console.error(error)
            alert('Error adding new collection')
        }
    }
    useEffect(() => {
        fetchCollection()
    }, [])
    return (
        <>
            <div style={{backgroundImage: "url('/gradiend-bg@2x.png')"}} className="w-fit bg-[size:100%_100%] bg-center mx-auto mt-16 bg-clip-text">
                <h1 className="w-fit text-4xl sm:text-6xl font-bold text-transparent">Collections</h1>
            </div>
            <div className="mx-auto text-center w-full max-w-md text-wrap mt-2">
                Explore the world through collections of beautiful photos free to use under the <u className="font-bold">Unsplash License</u>.
            </div>
            <div className="mx-auto w-fit">
                <button onClick={addCollection} className="px-4 py-2 w-fit outline outline-2 outline-primaryGray text-primaryGray dark:outline-secondaryGray dark:text-secondaryGray my-6 hover:bg-primaryGray hover:text-white dark:hover:bg-secondaryGray dark:hover:text-black hover:active:opacity-80 transition-all">
                    Add collection
                </button>
            </div>
            {collection?<main className="w-full mt-4 grid gap-4 justify-center items-center grid-cols-[repeat(auto-fill,min(25rem,100%))] auto-rows-[18rem]">
                {collection.map((collection,index) => <GridCollection id={collection.id} src={collection.covers} title={collection.title} total={collection.total} key={collection.id+index}/>)}
            </main>:<h1 className="text-center text-4xl font-bold animate-pulse mt-8">Loading...</h1>}
        </>
    )
}