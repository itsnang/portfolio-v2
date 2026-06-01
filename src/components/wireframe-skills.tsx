import { skillCategoryEnum } from "@/db/table";
import type { ISkill } from "@/types/profile.type";
import { Icons } from "@/components/icons";

export function WireframeSkills({ skills }: { skills: ISkill[] }) {
  return (
    <section style={{ padding: "84px 0" }} id="skills">
      <div className="contact-strip wf-reveal">
        <span className="contact-mini">
          <Icons.mapPin />
          Phnom Penh, KH
        </span>
        <a className="contact-mini" href="tel:+85570647779">
          <Icons.phone />
          +855 70 647 779
        </a>
        <a className="contact-mini" href="mailto:lorn.samnang.it@gmail.com">
          <Icons.email />
          lorn.samnang.it@gmail.com
        </a>
        <a
          className="contact-mini"
          href="https://lornsamnang.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.linkChain />
          lornsamnang.com
        </a>
      </div>

      <div
        className="wf-reveal"
        style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 38 }}
      >
        <span className="wf-m" style={{ fontSize: 14, color: "var(--wf-accent)" }}>
          01
        </span>
        <h2 className="wf-h" style={{ fontSize: 40 }}>
          Stack
        </h2>
        <span
          className="wf-m"
          style={{ fontSize: 14, color: "var(--wf-ink-soft)", marginLeft: "auto" }}
        >
          // the toolbox
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28, position: "relative" }}>
        {skillCategoryEnum.enumValues.map((cat) => {
          const group = skills.filter((s) => s.category === cat);
          if (group.length === 0) return null;
          return (
            <div key={cat}>
              <div className="wf-eyebrow wf-reveal" style={{ fontSize: 12, marginBottom: 10 }}>
                // {cat.toLowerCase()}
              </div>
              <div className="wf-reveal" style={{ display: "flex", flexWrap: "wrap", gap: 11 }}>
                {group.map((skill) => (
                  <span key={skill.id} className="wf-sketch wf-chip">
                    {skill.logoUrl && (
                      <img src={skill.logoUrl} alt="" className="wf-logo" />
                    )}
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        <div
          className="wf-note"
          style={{
            position: "absolute",
            bottom: -40,
            right: 0,
            width: 150,
            transform: "rotate(-3deg)",
          }}
        >
          drag-em onto a project,
          <br />
          they actually ship ✦
        </div>
      </div>
    </section>
  );
}
