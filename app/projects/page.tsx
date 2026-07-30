import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { SystemMap } from "@/components/system-map";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects", description: "Four independent Ordivon state owners for contracts, Tasks, local effects, and conditioned external interaction.", alternates: { canonical: "/projects" } };

export default function ProjectsPage() {
  return (
    <div className="page-shell page-top">
      <header className="index-hero"><p className="eyebrow">Projects</p><h1>Independent state owners, connected by evidence.</h1><p>Each project answers a different failure mode. The boundaries matter because a system becomes unreliable when one layer invents facts owned by another.</p></header>
      <SystemMap compact />
      <section className="project-directory">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} className="project-directory-card" key={project.slug}>
            <div className="directory-card-head"><span>{project.index}</span><p>{project.group}</p><b aria-hidden="true">↗</b></div>
            <h2>{project.title}</h2><h3>{project.thesis}</h3><p>{project.summary}</p>
            <dl><div><dt>Owns</dt><dd>{project.owns.slice(0, 2).join(" · ")}</dd></div><div><dt>Current state</dt><dd>{project.state}</dd></div></dl>
          </Link>
        ))}
      </section>
      <section className="portfolio-boundary"><SectionHeading index="06" eyebrow="Portfolio boundary" title="The stack is a graph, not one mandatory request pipeline." /><div><p>A local Runtime task may never cross into World. A World observation may exist before any Host Task. Computing can falsify a contract without owning production state.</p><p>Source, tests, data, receipts, and each repository&apos;s current documents remain the technical truth. This site provides orientation and dated interpretation.</p></div></section>
    </div>
  );
}
