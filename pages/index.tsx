import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Learning three.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/chapter-01">
        <a>Chapter 01</a>
      </Link>
    </div>
  )
}
