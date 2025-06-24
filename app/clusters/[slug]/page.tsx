import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import clusterData from "@/data/clusters/test.json";

type NewsCluster = {
  topic: string;
  summary: string;
  articles: {
    title: string;
    url: string;
    source: string;
  }[];
};

const ClusterPage = () => {
  const cluster: NewsCluster = clusterData;

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
      <div className="mt-8 text-muted-foreground italic">
        Persona reactions coming soon…
      </div>
    </Card>
    <Link href="/clusters" className="underline hover:text-primary">
      Back to clusters
    </Link>
    </div>
  );
};

export default ClusterPage;
