import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Redirecting to login',
};

export default function Home() {
  redirect('/login');
}

