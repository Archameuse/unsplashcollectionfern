import { FC, ReactNode, createContext, useEffect, useState } from "react"

interface ThemeProps {
    theme: 'dark'|'light',
    setTheme: Function
}

export const ThemeContext = createContext<ThemeProps>({
    theme: 'light',
    setTheme: () => {}
})

export const ThemeProvider:FC<{children:ReactNode}> = ({ children }) => {
    const [theme, setTheme] = useState<'dark'|'light'|null>(null)
    
    useEffect(() => {
        const localStorageTheme = localStorage.getItem('theme')
        if(localStorageTheme) {setTheme(
            localStorageTheme==='dark' ? 'dark' : 'light'
        )} else {
            if(matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
            else setTheme('light')
        }
    }, [])
    useEffect(() => {
        if(!theme) return
        localStorage.setItem('theme', theme)
        if(theme==='dark') {
            document.documentElement.classList.add('dark')
            document.documentElement.style.colorScheme = 'dark'
        }
        else if (theme==='light') {
            document.documentElement.classList.remove('dark')
            document.documentElement.style.colorScheme = 'light'
        }
    }, [theme])

    if(!theme) return null
    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}