import { AppConfigForm } from "@/features/app-config/components/app-config-form";
import { getAppConfigAction } from "@/features/app-config/actions";
import { AppConfig } from "@/db/table";

export const revalidate = 0;

export default async function AppConfigPage() {
  const result = await getAppConfigAction();
  const config = result.data as AppConfig;

  return (
    <section className="antialiased max-w-4xl space-y-16 border-gray-700 my-10 md:border-2 md:rounded-xl py-5 px-7 mx-auto">
      <AppConfigForm config={config} />
    </section>
  );
}
