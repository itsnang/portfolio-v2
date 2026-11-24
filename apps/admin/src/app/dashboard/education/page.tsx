import { EducationTable } from "@/features/education/components/education-table";
import { getEducations } from "@/features/education/admin-queries";

async function EducationPage() {
  const education = await getEducations();

  return <EducationTable items={education} />;
}

export default EducationPage;
