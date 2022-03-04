import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Page from '../components/page';
import User from '../models/data/pathology/user';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_SERVICE_URL + 'user', {credentials: 'include'}).then(async function(res) {
      setLoading(false);
      if (res.status === 200) {
        setUser(await res.json());
      }
    }).catch(err => {
      console.error(err);
    });
  }, []);

  function logOut() {
    fetch(process.env.NEXT_PUBLIC_SERVICE_URL + 'logout', {credentials: 'include'}).then(() => {
      setUser(undefined);
    });
  }

  return (loading ? null :
    <Page title={'Pathology'}>
      <>
        <div><Link href='/catalog'>CATALOG</Link></div>
        <div><Link href='/leaderboard'>LEADERBOARD</Link></div>
        {!user ?
          <div>
            <div><Link href='/login'>LOG IN</Link></div>
            <div><Link href='/signup'>SIGN UP</Link></div>
          </div> :
          <div>
            You are logged in as <span className='italic font-semibold'>{!user ? '' : user.name}</span>
            <br/>
            <button onClick={logOut}>LOG OUT</button>
          </div>
        }
      </>
    </Page>
  );
}