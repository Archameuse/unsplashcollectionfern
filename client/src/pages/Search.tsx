import { FC, useEffect, useRef, useState } from "react";
import { SearchBar } from "../components/SearchBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GridImage } from "../components/GridImage";
import axios, { AxiosError } from "axios";
import { UnsplashSearch } from "../types";

export const Search:FC = () => {
    const [params] = useSearchParams()
    const query = params.get('query')
    const [images,setImages] = useState<UnsplashSearch>()
    const [page,setPage] = useState<number>(1)
    const [isIntersecting, setIntersecting] = useState<boolean>(false)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const observerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const fetchImages = async () => {
        if(!query) return navigate('/')
        try {
            const {data} = await axios.get<UnsplashSearch>(process.env.REACT_APP_API+'images', {
                params: new URLSearchParams({
                    search: query
                })
            })
            setImages(data)
        } catch (error) {
            let {response} = error as AxiosError<AxiosError>
            if(response?.data?.status===403) {
                alert('Unsplash API limit has been reached. Please try again in an hour')
            }
            console.error(error)
            navigate('/')
        }
    }  
    const fetchMoreImages = async () => {
        if(page<=1) return
        if(loadingMore) return
        try {
            setLoadingMore(true)
            const {data} = await axios.get<UnsplashSearch>(process.env.REACT_APP_API+'images', {
                params: new URLSearchParams({
                    search: query??'',
                    page: JSON.stringify(page)
                })
            })
            setImages(old => {
                if(!old) return data
                else return ({...old, results: [...old?.results,...data.results]})
            })
            setLoadingMore(false)
        } catch (error) {
            let {response} = error as AxiosError<AxiosError>
            // let {data} = response?.data as AxiosError
            setLoadingMore(false)
            console.log(response)
            if(response?.data?.status===403) {
                alert('Unsplash API limit has been reached, please try again in an hour.')
            } else alert('Error fetching more images')
        }
    }

    useEffect(() => {
        fetchImages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])
    useEffect(() => {
        fetchMoreImages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])



    useEffect(() => {
        const el = observerRef.current
        if(!el) return
        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting)
        })
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [images])

    useEffect(() => {
        if(!isIntersecting) return
        if(loadingMore) return
        setPage(old => Math.min(old+1,images?.total_pages??old))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isIntersecting])

    return (
        <>
            <img draggable={false} alt="Gradient background" className="w-full h-20 object-cover" src="/gradiend-bg.svg"/>
            <div className="flex w-full justify-center -translate-y-1/2">
                <SearchBar defaultValue={query??undefined}/>
            </div>
            {images ? <main className="grid justify-center items-center gap-4 grid-cols-[repeat(auto-fill,18rem)] auto-rows-[12rem] grid-flow-dense relative pb-16">
                {images.results.map((image,index) => <GridImage src={image.urls.small} id={image.id} key={image.id+index} width={image.width} height={image.height} alt={image.alt_description}/>)}
                <div ref={observerRef} className="absolute bottom-2 w-full h-1 opacity-0"></div>
            </main> : <h1 className="text-center text-4xl font-bold animate-pulse">Loading...</h1>}
            {loadingMore && 
            <div className="fixed bottom-0 h-16 w-16 left-1/2 -translate-x-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"><path strokeDasharray="2 4" strokeDashoffset="6" d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"><animate attributeName="stroke-dashoffset" dur="0.6s" repeatCount="indefinite" values="6;0"></animate></path><path strokeDasharray="30" strokeDashoffset="30" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.1s" dur="0.3s" values="30;0"></animate></path><path strokeDasharray="10" strokeDashoffset="10" d="M12 16v-7.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="10;0"></animate></path><path strokeDasharray="6" strokeDashoffset="6" d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="6;0"></animate></path></g></svg>
            </div>}
        </>
    )
}
