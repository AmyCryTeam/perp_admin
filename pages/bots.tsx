import type { NextPage } from 'next'
import { BotsPageContent } from '../client/components/BotsPage/BotsPage'
import { Header } from '../client/components/Header/Header'

const Bots: NextPage = () => {
    return (
        <>
            <Header />
            <BotsPageContent />
        </>
    )
}

export default Bots
