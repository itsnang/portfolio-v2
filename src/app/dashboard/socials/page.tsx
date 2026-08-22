import { SocialsTable } from "@/features/socials/components/socials-table";
import { getSocialsAction } from "@/features/socials/actions";
import { getImages } from "@/features/media/actions";

async function SocialsPage() {
  const [images, socials] = await Promise.all([getImages(), getSocialsAction()]);

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <SocialsTable items={socials} images={images} />
    </section>
  );
}
export default SocialsPage;
