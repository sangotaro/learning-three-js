import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Index: NextPage = () => {
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
  );
};

export default Index;
