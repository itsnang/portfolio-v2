import { getProfile } from "./action";

export default async function Home() {
  const test = await getProfile();
  console.log(test);
  return (
    <main>
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <p>
                <span>Hi, I&apos;m</span>
                <span></span>
              </p>
              <p>hhh</p>
            </div>
            <p>avatar</p>
          </div>
        </div>
      </section>
    </main>
  );
}
