import { SocialsTable } from "@/components/socials-table";
import { getSocials } from "./action";
import { getImages } from "../images/action";

async function SocialsPage() {
  const [images, socials] = await Promise.all([getImages(), getSocials()]);

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <SocialsTable items={socials} images={images} />
    </section>
  );
}
export default SocialsPage;
