import { AppConfigForm } from "@/features/app-config/components/app-config-form";
import { getAppConfig } from "@/features/app-config/queries";

export const revalidate = 0;

export default async function AppConfigPage() {
  const config = await getAppConfig();

  return <AppConfigForm config={config} />;
}
