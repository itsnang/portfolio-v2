import { RecommendationsTable } from "@/components/recommendations-table";
import { getRecommendations } from "./action";
import { getImages } from "../images/action";

async function RecommendationsPage() {
  const [images, recommendations] = await Promise.all([
    getImages(),
    getRecommendations(),
  ]);

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <RecommendationsTable items={recommendations} images={images} />
    </section>
  );
}

export default RecommendationsPage;
