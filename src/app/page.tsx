import Leaderboard from "../../components/Leaderboard";
import Layout from "../../components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <Leaderboard />
      </div>
    </Layout>
  );
}
