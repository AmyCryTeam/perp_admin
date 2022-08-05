import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'react-bootstrap'
import { BREAKPOINTS, BREAKPOINTS_KEYS } from '../constants/ui'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider
            breakpoints={BREAKPOINTS}
            minBreakpoint={BREAKPOINTS_KEYS.XXS}
        >
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp
