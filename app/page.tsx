import Link from "next/link";
import { Mail, MapPin, Briefcase, GraduationCap, BookOpen, ExternalLink, Cpu, PenLine } from "lucide-react";
import { allPosts } from "./blog/posts";

const experience = [
  {
    title: "Staff Site Reliability Engineer",
    company: "Indeed",
    period: "Apr 2024 – Present",
  },
  {
    title: "Senior Site Reliability Engineer",
    company: "Indeed",
    period: "Jul 2022 – Apr 2024",
  },
  {
    title: "Site Reliability Engineer II",
    company: "Indeed",
    period: "Jan 2022 – Jul 2022",
  },
  {
    title: "Site Reliability Engineer",
    company: "Indeed",
    period: "Oct 2019 – Dec 2021",
  },
];

const education = [
  {
    degree: "Master's in Computer Software Engineering",
    school: "Tsinghua University",
    period: "2016 – 2019",
  },
  {
    degree: "Bachelor's in Computer Software Engineering",
    school: "Nanjing University",
    period: "2012 – 2016",
  },
];

const technicalFocus = [
  {
    area: "Kafka & Event Streaming",
    detail:
      "Durability guarantees (acks, ISR, min.insync.replicas), idempotent producers, exactly-once semantics via transactions, HW vs LSO, consumer group rebalancing, Kafka Streams state store management and restoration.",
  },
  {
    area: "Distributed Systems",
    detail:
      "Fault tolerance, consistency tradeoffs, backpressure handling, and debugging production incidents in large-scale stream processing systems.",
  },
  {
    area: "Observability & SRE",
    detail:
      "Designing alerting that catches what metrics miss — e.g. consumer lag against LSO rather than high watermark, silent state corruption from missing exception handlers.",
  },
];

const publications = [
  {
    title: "Interference Relation-Guided SMT Solving for Multi-Threaded Program Verification",
    venue: "PPoPP 2022 — Best Paper Award",
  },
];

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 space-y-14">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Weiting Liu</h1>
        <p className="mt-1 text-lg text-neutral-500 dark:text-neutral-400">
          Staff Site Reliability Engineer at Indeed
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          <MapPin size={14} />
          <span>Tokyo, Japan</span>
        </div>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Joined Indeed in 2019 after graduating from Tsinghua University with a Master&apos;s
          degree in Software Engineering. I moved to Tokyo and have lived here ever since.
          I spend my time building reliable, large-scale systems and thinking deeply about
          distributed systems, event streaming, observability, and engineering culture.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4">
          Contact
        </h2>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:liuweiting94@gmail.com"
            className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <Mail size={15} />
            liuweiting94@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/weiting-liu-b49352223/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <ExternalLink size={15} />
            linkedin.com/in/weiting-liu-b49352223
          </a>
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
          <Briefcase size={14} />
          Experience
        </h2>
        <div className="space-y-5">
          {experience.map((job) => (
            <div key={job.period}>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{job.title}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {job.company} · {job.period}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
          <GraduationCap size={14} />
          Education
        </h2>
        <div className="space-y-5">
          {education.map((edu) => (
            <div key={edu.period}>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{edu.degree}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {edu.school} · {edu.period}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Focus */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
          <Cpu size={14} />
          Technical Focus
        </h2>
        <div className="space-y-5">
          {technicalFocus.map((item) => (
            <div key={item.area}>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.area}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-0.5">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Writing */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 flex items-center gap-2">
          <PenLine size={14} />
          Writing
        </h2>
        <div className="space-y-8">
          {allPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block pl-4 border-l-2 border-transparent hover:border-[#c9a84c] transition-colors duration-200"
            >
              <p
                className="text-xs tracking-[0.18em] uppercase mb-1"
                style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}
              >
                {post.category}
              </p>
              <p
                className="text-lg leading-snug mb-1 text-neutral-900 dark:text-neutral-100 group-hover:text-[#1a1612] transition-colors"
                style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}
              >
                {post.title}
              </p>
              <p
                className="text-sm italic leading-relaxed text-neutral-500 dark:text-neutral-400 mb-2"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                {post.subtitle}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                {post.date}
                <span className="mx-2" style={{ color: "#c9a84c" }}>·</span>
                {post.readingTime}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 flex items-center gap-2">
          <BookOpen size={14} />
          Publications
        </h2>
        <div className="space-y-4">
          {publications.map((pub) => (
            <div key={pub.title}>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">{pub.title}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{pub.venue}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
