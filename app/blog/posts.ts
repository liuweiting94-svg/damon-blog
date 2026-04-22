export type PostMeta = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  date: string;
  readingTime: string;
};

export const allPosts: PostMeta[] = [
  {
    slug: "interference-relation-smt",
    category: "Research",
    title: "Teaching an SMT Solver to Think About Threads",
    subtitle:
      "The idea behind our Best Paper at PPoPP 2022 — and why treating your solver as a black box leaves performance on the table.",
    date: "April 22, 2026",
    readingTime: "6 min read",
  },
  {
    slug: "kafka-consumer-lag",
    category: "Distributed Systems",
    title: "Your Kafka Lag Monitor Is Lying to You",
    subtitle:
      "High watermarks feel safe. They aren't. Here's the quiet failure mode that will burn you at 3 a.m.",
    date: "April 18, 2026",
    readingTime: "9 min read",
  },
];
