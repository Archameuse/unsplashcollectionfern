export interface UnsplashSearch {
    total: number;
    total_pages: number;
    results: UnsplashImage[]
}

export interface UnsplashImage {
    id: string;
    alt_description: string;
    width: number;
    height: number;
    created_at: string;
    urls: {raw: string; full: string; small: string;}
    links: {download_location: string;}
    collections?: UnsplashCollection<string>[];
    user: {
        id: string;
        links: {html: string};
        name: string;
        profile_image: {
            small: string;
            medium: string;
            large: string;
        }
    }
}

export interface UnsplashCollection<T extends string|string[] > {
    id: string;
    title: string;
    total: number;
    covers: T
}

export interface UnsplashCollectionDetails {
    id: string;
    title: string;
    total: number;
    photos: UnsplashImage[]
}