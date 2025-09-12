import { SocialsForm } from "@/components/form/socials-form";

import { getImages } from "../images/action";

async function SocialsPage() {
  const images = await getImages();
  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <SocialsForm images={images} />
    </section>
  );
}
export default SocialsPage;
