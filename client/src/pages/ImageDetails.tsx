import { FC, useEffect, useState } from "react";
import { RowCollection } from "../components/RowCollection";
import { AddCollectionModal } from "../components/AddCollectionModal";
import { UnsplashCollection, UnsplashImage } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";

export const ImageDetails:FC = () => {
    const [showModal, setShowModal] = useState<boolean>(false)
    const [image, setImage] = useState<UnsplashImage>()
    const [downloading, setDownloading] = useState<boolean>(false)
    const {id} = useParams()
    const navigate = useNavigate()
    const fetchImage = async () => {
        try {
            if(!id) throw new Error('No id on page')
            const {data} = await axios.get<UnsplashImage>(process.env.REACT_APP_API+'image', {
                params: new URLSearchParams({
                    id
                })
            })
            const img = new Image()
            img.onload = () => {
                setImage(data)
            }
            img.onerror = (error) => {
                console.log('Something went wrong preloading image')
                setImage(data)
            }
            img.alt = 'preload'
            img.src = data.urls.full
        } catch (error) {
            let {response} = error as AxiosError<AxiosError>
            if(response?.data?.status===403) {
                alert('Unsplash API limit has been reached. Please try again in an hour.')
            }
            console.error(error)
            navigate('/')
        }
    }
    const download = async () => {
        if(downloading) return
        if(!image?.id) return alert('Image does not have id or does not even exist')
        if(!image?.links.download_location) return alert ('Image doesnt have download link')
        setDownloading(true)
        try {
            const ixid = image.links.download_location.split('=')[1]
            if(!ixid) throw new Error('Something went wrong when gettiing ixid')
            await axios.get(process.env.REACT_APP_API+'download', {
                params: new URLSearchParams({
                    id:image.id,
                    ixid
                })
            })
            setDownloading(false)
            window.open(image.urls.raw)
        } catch (error) {
            console.error(error)
            alert('Error downloading')
            setDownloading(false)
        }
    }

    const removeFromCollection = async (id?:string) => {
        if(!image) return alert('no image is present')
        if(!id) return alert('no collection id recieved')
        try {
            await axios.delete(process.env.REACT_APP_API+'collections', {
                params: new URLSearchParams({
                    photo_id: image.id,
                    collection_id: id
                })
            })
            setImage(
                old => {
                    if(!old)return old
                    else return {
                        ...old, 
                        collections: old.collections?.filter(el => id?(el.id!==id):true)
                    }
                }
            )
        } catch (error) {
            console.error(error)
            alert('Error removing form collection')
        }
    }

    useEffect(() => {
        fetchImage()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if(!image) return (
        <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-center text-4xl font-bold animate-pulse">Loading...</h1>
        </div>
    )
    return (
        <div className="w-full max-w-screen-lg m-auto flex justify-center flex-wrap gap-4 py-8 px-2">
            <div className="overflow-hidden max-w-full">
                <img className="min-w-80 max-h-[40rem] flex-grow-[9999999999] object-cover rounded-md shadow-md" alt={image.alt_description??'main image'} src={image.urls.full}/>
            </div>
            <div className="flex flex-col flex-grow min-w-sm p-8 pt-0 gap-6">
                <div className="flex flex-col gap-2">
                    <a href={image.user.links.html} className="flex items-center gap-4">
                        <img src={image.user.profile_image.small} alt={image.user.name + "'s Avatar"} className="w-12 h-12 rounded-full"/>
                        {image.user.name}
                    </a>
                    <span className="text-sm font-light text-primaryGray dark:text-secondaryGray">Published on {new Date(image.created_at).toLocaleString('en', {day: '2-digit', month: 'long', year: 'numeric'})}</span>
                    <div className="flex gap-4 text-sm">
                        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-secondaryGray dark:bg-secondaryBlack rounded-md px-4 py-2 hover:opacity-80 hover:active:opacity-90">
                            <img draggable={false} alt="Add to collection icon" className="dark:invert" src="/Plus.svg"/>
                            Add to Collection
                        </button>
                        {!downloading?<button onClick={download} className="flex items-center gap-2 bg-secondaryGray dark:bg-secondaryBlack rounded-md px-4 py-2 hover:opacity-80 hover:active:opacity-90">
                            <div className="w-4 h-4">
                                <img draggable={false} alt="Download icon" className="dark:invert" src="/down arrow.svg"/>
                            </div>
                            Download
                        </button>: 
                        <button className="flex items-center gap-2 bg-secondaryGray dark:bg-secondaryBlack rounded-md px-4 py-2 cursor-not-allowed opacity-90">
                            <div className="w-4 h-4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"><path strokeDasharray="2 4" strokeDashoffset="6" d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"><animate attributeName="stroke-dashoffset" dur="0.6s" repeatCount="indefinite" values="6;0"></animate></path><path strokeDasharray="30" strokeDashoffset="30" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.3s" values="30;0"></animate></path><path strokeDasharray="10" strokeDashoffset="10" d="M12 16v-7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="10;0"></animate></path><path strokeDasharray="6" strokeDashoffset="6" d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="6;0"></animate></path></g></svg>
                            </div>
                            Download
                        </button>}
                    </div>
                </div>
                <div className="flex flex-col gap-4 max-h-[30rem] overflow-y-auto">
                    {image.collections?.map(collection => <RowCollection src={collection.covers} name={collection.title} id={collection.id} total={collection.total} key={collection.id} action={async (id?:string) => await removeFromCollection(id)}/>)}
                </div>
            </div>
            {(showModal&&image)&&<AddCollectionModal photo={image} close={() => setShowModal(false)} emit={(collection:UnsplashCollection<string>) => setImage(old => {if(!old)return old; else return {...old, collections:[{...collection, total:collection.total+1, covers: collection.covers??image.urls.small}, ...old.collections??[]]}})}/>}
        </div>
    )
}