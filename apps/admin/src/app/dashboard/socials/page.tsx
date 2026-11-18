import { SocialsTable } from "@/features/socials/components/socials-table";
import { getSocialsAction } from "@/features/socials/actions";

async function SocialsPage() {
  const socials = await getSocialsAction();

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <SocialsTable items={socials} />
    </section>
  );
}
export default SocialsPage;
