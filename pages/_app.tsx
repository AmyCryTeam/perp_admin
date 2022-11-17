import '../client/styles/globals.scss'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'react-bootstrap'
import { BREAKPOINTS, BREAKPOINTS_KEYS } from '../client/constants/ui'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <ThemeProvider
                breakpoints={BREAKPOINTS}
                minBreakpoint={BREAKPOINTS_KEYS.XXS}>
                <Component {...pageProps} />
            </ThemeProvider>
        </SessionProvider>
    )
}

export default MyApp
