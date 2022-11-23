import type { NextPage } from 'next'
import { Header } from '../client/components/Header/Header'
import { HomePageContent } from '../client/components/HomePage/HomePage'
import {useSession} from "next-auth/react";
import {AUTH_STATUSES} from "../client/constants/ui";

const Home: NextPage = () => {
  const { status } = useSession();
  
  return (
        <>
          <Header />
          {status === AUTH_STATUSES.AUTHENTICATED && (
            <HomePageContent />
          )}
        </>
    )
}

export default Home
