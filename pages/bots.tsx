import type { NextPage } from 'next'
import { BotsPageContent } from '../client/components/BotsPage/BotsPage'
import { Header } from '../client/components/Header/Header'
import {useSession} from "next-auth/react";
import {AUTH_STATUSES} from "../client/constants/ui";
import {useRouter} from "next/router";
import {useEffect} from "react";

const Bots: NextPage = () => {
  const { status } = useSession();
  const router = useRouter()
  
  useEffect(() => {
    if (status === AUTH_STATUSES.UNAUTHENTICATED) {
      router.push('/api/auth/signin')
    }
  }, [status])
  
  console.log('status', status)
  
  return (
        <>
          <Header />
          {status === AUTH_STATUSES.AUTHENTICATED && (
            <BotsPageContent />
          )}
        </>
    )
}

export default Bots
