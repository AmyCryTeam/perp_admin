import type { NextPage } from 'next'
import { Header } from '../client/components/Header/Header'
import { HomePageContent } from '../client/components/HomePage/HomePage'

const Home: NextPage = () => {
    return (
        <>
            <Header />
            <HomePageContent />
        </>
    )
}

export default Home
