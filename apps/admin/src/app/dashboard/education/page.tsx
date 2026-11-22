import { EducationTable } from "@/features/education/components/education-table";
import { getEducations } from "@/features/education/actions";

async function EducationPage() {
  const education = await getEducations();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <EducationTable items={education} />
    </section>
  );
}

export default EducationPage;
