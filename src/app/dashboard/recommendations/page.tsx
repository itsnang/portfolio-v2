import { RecommendationsTable } from "@/features/recommendations/components/recommendations-table";
import { getRecommendations } from "@/features/recommendations/actions";

async function RecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <RecommendationsTable items={recommendations} />
    </section>
  );
}

export default RecommendationsPage;
