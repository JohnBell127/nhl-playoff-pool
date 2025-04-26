import Leaderboard from "../../components/Leaderboard";
import Layout from "../../components/Layout";

import { Analytics } from '@vercel/analytics/next';

export default function Home() {
  return (
    <Layout>
      <Analytics />
      <div className="container mx-auto py-8 px-4">
        <Leaderboard />
      </div>
    </Layout>
  );
}
