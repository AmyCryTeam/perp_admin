import type { NextPage } from 'next'
import { Header } from '../../client/components/Header/Header'
import { LogsPageContent } from '../../client/components/LogsPage/LogsPage'

const Bots: NextPage = () => {
    return (
        <>
            <Header />
            <LogsPageContent />
        </>
    )
}

export default Bots
