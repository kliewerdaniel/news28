import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import fs from "fs/promises";
import path from "path";
import * as yaml from "js-yaml";
import ClusterReactions from "@/components/persona/ClusterReactions";

export type NewsCluster = {
  topic: string;
  summary: string;
  articles: {
    title: string;
    url: string;
    source: string;
  }[];
};

export type Persona = {
  name: string;
  skepticism?: number;
  empathy?: number;
  confidence?: number;
  [trait: string]: unknown;
};

const ClusterPage = async ({ params }: { params: { slug: string } }) => {
  try {
    const slug = await Promise.resolve(params.slug);
    const cluster: NewsCluster = await fs.readFile(
      path.join(process.cwd(), `data/clusters/${slug}.json`),
      "utf-8"
    ).then(JSON.parse);

    const personaFiles = await fs.readdir("data/personas");
    const personas = await Promise.all(
      personaFiles.map(async (file) => {
        const yamlText = await fs.readFile(`data/personas/${file}`, "utf-8");
        const parsed = yaml.load(yamlText) as Persona;
        return { ...parsed, slug: file.replace(/\.yaml$/, "") };
      })
    );

    return (
      <div className="flex flex-col gap-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">{cluster.topic}</h1>
          <p className="text-muted-foreground">{cluster.summary}</p>
          <section className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Articles</h3>
            <ul>
              {cluster.articles.map((article) => (
                <li key={article.url} className="mb-2">
                  <a
                    href={article.url}
                    className="underline hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({article.source})
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <ClusterReactions personas={personas} cluster={cluster} />
        </Card>
        <Link href="/clusters" className="underline hover:text-primary">
          Back to clusters
        </Link>
      </div>
    );
  } catch (error) {
    console.error("Error loading cluster:", error);
    return (
      <div className="flex flex-col gap-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-500">Error</h1>
          <p className="text-muted-foreground">Failed to load cluster data.</p>
        </Card>
        <Link href="/clusters" className="underline hover:text-primary">
          Back to clusters
        </Link>
      </div>
    );
  }
};

export default ClusterPage;
