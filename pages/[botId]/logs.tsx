import type { NextPage } from 'next'
import { Header } from '../../client/components/Header/Header'
import { LogsPageContent } from '../../client/components/LogsPage/LogsPage'
import {useSession} from "next-auth/react";
import { useRouter } from 'next/router'
import {AUTH_STATUSES} from "../../client/constants/ui";
import {useEffect} from "react";

const Bots: NextPage = () => {
  const { status } = useSession();
  const router = useRouter()
  
  useEffect(() => {
    if (status === AUTH_STATUSES.UNAUTHENTICATED) {
      router.push('/api/auth/signin')
    }
  }, [status])
  
  return (
        <>
          <Header />
          {status === AUTH_STATUSES.AUTHENTICATED && (
            <LogsPageContent />
          )}
        </>
    )
}

export default Bots
