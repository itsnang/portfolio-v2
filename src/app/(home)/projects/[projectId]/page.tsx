import React from "react";
import SparklesText from "@/components/ui/sparkles-text";
import { getProjectDetail } from "./action";
import Image from "next/image";

async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;
  const projectDetail = await getProjectDetail(projectId);
  console.log(projectDetail);
  return (
    <section>
      <div className="aspect-video overflow-hidden rounded-xl bg-muted/50 relative">
        <Image
          alt={projectDetail.title}
          src={projectDetail.thumbnail}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-6 space-y-4">
        <SparklesText className="text-4xl" text={projectDetail.title} />
        <p>{projectDetail.description}</p>
        <div className="flex pt-4 flex-wrap gap-3">
          {projectDetail.technologies.map((technology, index) => {
            return (
              <div
                key={index}
                className="disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center gap-1"
              >
                <Image
                  src={technology.logoUrl}
                  alt={technology.name}
                  width={20}
                  height={20}
                />
                <span className="font-medium text-sm">{technology.name}</span>
              </div>
            );
          })}
        </div>

        {projectDetail.detailImage !== null ? (
          <div className="pt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projectDetail.detailImage!.map((detail, index) => {
              return (
                <div className=" overflow-hidden" key={index}>
                  <Image
                    width={400}
                    height={400}
                    key={index}
                    src={detail}
                    className="object-cover rounded-xl"
                    alt={projectDetail.title}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ProjectDetailPage;
