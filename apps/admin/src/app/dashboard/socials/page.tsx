import { SocialsTable } from "@/features/socials/components/socials-table";
import { getSocials } from "@/features/socials/admin-queries";

async function SocialsPage() {
  const socials = await getSocials();

  return <SocialsTable items={socials} />;
}
export default SocialsPage;
