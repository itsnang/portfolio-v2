import React from "react";
import { getCurrentUser } from "@/lib/lucia/session";
import { redirect } from "next/navigation";
import { getImages } from "../images/action";
import { RecommendationsForm } from "@/components/form/recommendations-form";
import { insertRecommendation } from "./action";
import { RecommendationsInsert } from "@/db/schema/recommendations.schema";

async function RecommendationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const images = await getImages();

  const handleSubmit = async (data: RecommendationsInsert) => {
    "use server";
    await insertRecommendation(data);
  };

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <RecommendationsForm images={images} onSubmit={handleSubmit} />
    </section>
  );
}

export default RecommendationsPage;
