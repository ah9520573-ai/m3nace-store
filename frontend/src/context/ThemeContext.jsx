import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(null);
export function ThemeProvider({ children }) { const [theme, setTheme] = useState(() => localStorage.getItem('m3nace_theme') || 'light'); useEffect(() => { localStorage.setItem('m3nace_theme', theme); document.documentElement.dataset.theme = theme; document.querySelector('.app')?.classList.toggle('light', theme === 'light'); }, [theme]); return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>; }
export const useTheme = () => useContext(ThemeContext);
