import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressBar } from "./ProgressBar";

const posts: Record<string, Post> = {
  "interference-relation-smt": {
    slug: "interference-relation-smt",
    category: "Research",
    title: "Teaching an SMT Solver to Think About Threads",
    subtitle:
      "The idea behind our Best Paper at PPoPP 2022 — and why treating your solver as a black box leaves performance on the table.",
    author: "Weiting Liu",
    date: "April 22, 2026",
    readingTime: "6 min read",
    content: [
      {
        type: "lede",
        text: "Formal verification of concurrent programs has a reputation for being slow. Some of that slowness is fundamental. But some of it comes from ignoring structure that was sitting in plain sight.",
      },
      {
        type: "section",
        heading: "The problem with thread interleavings",
        body: "Proving that a multi-threaded program is correct means accounting for every order in which threads can execute. The space of possible interleavings grows exponentially with thread count — a fact that has kept concurrent program verification largely out of reach for real-world codebases.\n\nThe standard engineering response is to encode the program as a formula and hand it to an SMT solver. The solver searches the formula space for a counterexample, or proves no counterexample exists. This works, but it treats the SMT solver as a black box: all the structure of the concurrent program gets flattened into a pile of constraints, and the solver has to rediscover that structure on its own.",
      },
      {
        type: "pullquote",
        text: "Not all threads can interfere with each other at every point. That constraint is knowable before you ever call the solver — so why not tell it?",
      },
      {
        type: "section",
        heading: "Interference relations as solver guidance",
        body: "Our key observation was that thread interferences in real programs have structure. An interference happens when one thread reads a memory location that another thread has written. But which threads write which locations, and when, is not arbitrary — it is determined by the program's control flow and data flow.\n\nWe define an **interference relation**: a statically computed map of which thread actions can actually affect which other threads. If thread A never writes to a variable that thread B reads, they cannot interfere on that variable, and the solver does not need to consider that ordering.\n\nThe prototype tool, **Zpre**, extracts this interference relation from the program before invoking the SMT backend. Instead of a monolithic formula, the solver receives guidance about which portions of the search space are reachable — turning a black-box query into a more directed one.",
      },
      {
        type: "section",
        heading: "Memory models matter",
        body: "Modern processors do not execute instructions in the order you write them. The **memory consistency model** defines which reorderings are permitted. We evaluated Zpre across three models:\n\n- **SC** (Sequential Consistency) — the intuitive model: instructions execute in order across all threads.\n- **TSO** (Total Store Order) — used by x86; write operations can be delayed in a store buffer.\n- **PSO** (Partial Store Order) — a further relaxation where different memory locations can have independent store buffers.\n\nVerification under TSO and PSO is harder than SC because the solver must also account for the additional behaviors introduced by the memory model. The interference relation approach generalises across all three, which was a non-obvious part of the design.",
      },
      {
        type: "pullquote",
        text: "The interference relation does not change what the solver proves. It changes how quickly the solver finds the proof.",
      },
      {
        type: "section",
        heading: "Results",
        body: "We benchmarked Zpre against CBMC, the leading bounded model checker, using the ConcurrencySafety category from the 2019 SV-COMP competition. Across all three memory models, Zpre solved more benchmarks within the time limit and spent less time on the benchmarks both tools solved.\n\nThe improvement was not uniform — programs with tightly coupled threads and frequent shared-memory access benefited most, because those are exactly the cases where the interference relation is most selective. Programs where every thread touches the same variables saw smaller gains, since the relation rules out fewer orderings.",
      },
      {
        type: "closing",
        text: "The paper won the Best Paper Award at PPoPP 2022. I have moved from formal methods research into production systems engineering since then, but the underlying instinct carries over: when you have domain knowledge about the structure of a problem, encoding that knowledge explicitly almost always beats hoping that a general-purpose solver will find it on its own. That is as true for an SMT backend as it is for a Kafka consumer lag monitor.",
      },
    ],
  },
  "kafka-consumer-lag": {
    slug: "kafka-consumer-lag",
    category: "Distributed Systems",
    title: "Your Kafka Lag Monitor Is Lying to You",
    subtitle:
      "High watermarks feel safe. They aren't. Here's the quiet failure mode that will burn you at 3 a.m.",
    author: "Weiting Liu",
    date: "April 18, 2026",
    readingTime: "9 min read",
    content: [
      {
        type: "lede",
        text: "For years I watched engineers celebrate green dashboards while messages quietly rotted inside transactions. The problem wasn't their monitoring stack. It was the number they chose to monitor.",
      },
      {
        type: "section",
        heading: "Two watermarks walk into a broker",
        body: "Every Kafka partition carries two markers that define what consumers can read. The **high watermark** (HW) is the offset of the last message fully replicated across all in-sync replicas. It's the number most dashboards show as the 'end offset' when calculating lag.\n\nThe **last stable offset** (LSO) is something quieter. It is the highest offset below which all transactions are guaranteed to have been committed or aborted. A consumer running in `read_committed` isolation mode can only advance up to the LSO, never past it.\n\nWhen there are no transactions on the topic, LSO equals HW. When a producer opens a transaction and sits idle — network blip, application deadlock, runaway GC pause — the LSO stops moving. The HW keeps advancing as non-transactional messages pile in. The gap between them is invisible to every lag monitor that watches only the high watermark.",
      },
      {
        type: "pullquote",
        text: "Your consumer thinks it is current. Your dashboard agrees. Neither of them is reading the messages sitting inside the open transaction.",
      },
      {
        type: "section",
        heading: "The exact failure mode",
        body: "Here is the scenario I have seen unfold in production more than once:\n\n1. A producer opens a transaction and writes 50,000 messages.\n2. Before committing, the producer process is paused by a long GC cycle.\n3. Non-transactional producers keep writing to the same partition.\n4. Consumers in `read_committed` mode are blocked at the LSO. Consumer lag against HW shows zero — all caught up.\n5. Ten minutes later, someone asks why job completions are 50,000 short.\n\nThe silence is the problem. There is no error, no timeout, no alert. The consumer is simply waiting at a fence it cannot see.",
      },
      {
        type: "section",
        heading: "What to monitor instead",
        body: "Swap the denominator. Calculate consumer lag as `LSO - consumer_committed_offset`, not `HW - consumer_committed_offset`. Most monitoring libraries expose this as a configuration toggle, though buried in the docs.\n\nBeyond lag, add a dedicated alert for **transaction duration**. Any producer transaction that remains open beyond your 95th-percentile processing latency is a candidate for an alert. Kafka exposes `kafka.producer:type=producer-metrics,client-id=*:transaction-coordinator-epoch` and the broker-side `TransactionalIdExpiration` events, both of which surface stalled transactions before they become consumer emergencies.\n\nA third signal worth wiring up: if you run Kafka Streams, watch the state store restoration metric `restore-consumer-records-lead`. A consumer group that has fallen behind will rebuild state from scratch on restart. The restoration time is proportional to the committed lag — which is proportional to how long you were watching the wrong number.",
      },
      {
        type: "pullquote",
        text: "Lag against LSO is quiet when it should be. Lag against HW is quiet even when it shouldn't be.",
      },
      {
        type: "section",
        heading: "The exception handler you forgot",
        body: "One more failure mode that composites badly with the above: `read_committed` consumers that hit a deserialization error and swallow the exception will stop processing but will not move their committed offset. Lag stays non-zero. Lag against LSO grows. But if the error handler is a no-op — or worse, a `log.error` followed by a `continue` — the consumer loop keeps spinning, burning CPU without making progress.\n\nThis is the state corruption variant of the problem: not a transaction stall, but a message your consumer can see, can read the header of, and simply cannot deserialize. Combined with missing exception handlers, it generates a consumer that appears alive to liveness probes but is making no forward progress whatsoever.\n\nThe fix is deliberate: dead-letter the unparseable message, increment a counter metric with the topic and partition label, and keep the committed offset advancing. Never silently swallow and `continue`.",
      },
      {
        type: "section",
        heading: "A checklist before you ship",
        body: "Before a Kafka consumer goes to production, I run through four questions:\n\n**1. What isolation mode?** If `read_committed`, your lag metric must be against LSO.\n\n**2. What happens on deserialization failure?** If the answer is 'an exception is logged', ask what happens *next*. The offset must advance.\n\n**3. What is your transaction timeout?** The default `transaction.timeout.ms` is 60 seconds. If your processing pipeline can run longer, raise it. If it can't, enforce the timeout explicitly and alert when it fires.\n\n**4. Where does state come from on restart?** If your Streams app rebuilds from a changelog topic, your committed lag directly sets the recovery time window. Test this deliberately in staging, with real load, before you hit it at 3 a.m.",
      },
      {
        type: "closing",
        text: "Most of the incidents I have worked on in large-scale event streaming systems were not caused by Kafka. They were caused by the assumptions engineers made about what Kafka's numbers meant. HW is an infrastructure metric. LSO is a consumer metric. The two are equal only in the absence of transactions — and the moment you adopt exactly-once semantics, you need to know which watermark you are watching.",
      },
    ],
  },
};

type ContentBlock =
  | { type: "lede"; text: string }
  | { type: "section"; heading: string; body: string }
  | { type: "pullquote"; text: string }
  | { type: "closing"; text: string };

type Post = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readingTime: string;
  content: ContentBlock[];
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

function renderParagraph(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} style={{ fontFamily: "var(--font-playfair)", fontWeight: 600 }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function renderBody(body: string) {
  const paragraphs = body.split("\n\n");
  return paragraphs.map((para, i) => {
    if (para.startsWith("1. ") || para.match(/^\d+\./)) {
      const items = para.split("\n").filter(Boolean);
      return (
        <ol key={i} className="list-decimal list-inside space-y-2 my-6 pl-4">
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed">
              {renderParagraph(item.replace(/^\d+\.\s/, ""))}
            </li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="mb-6 leading-[1.85]">
        {renderParagraph(para)}
      </p>
    );
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <>
      <ProgressBar />

      <div className="max-w-[680px] mx-auto px-6 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: "#5a5148", fontFamily: "var(--font-dm-serif)" }}
        >
          <span aria-hidden>←</span>
          <span className="hover:underline underline-offset-2">Home</span>
        </Link>
      </div>

      <article
        className="max-w-[680px] mx-auto px-6 pt-10 pb-32"
        style={{ color: "#1a1612" }}
      >
        {/* Category */}
        <p
          className="text-xs tracking-[0.2em] uppercase mb-8"
          style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}
        >
          {post.category}
        </p>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl leading-[1.15] mb-6"
          style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, color: "#1a1612" }}
        >
          {post.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl italic leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-dm-serif)", color: "#5a5148" }}
        >
          {post.subtitle}
        </p>

        {/* Rule */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: "#c9a84c", opacity: 0.35 }} />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-playfair)", color: "#5a5148" }}
          >
            ✦
          </span>
          <div className="h-px flex-1" style={{ background: "#c9a84c", opacity: 0.35 }} />
        </div>

        {/* Byline */}
        <div
          className="flex items-center justify-between text-sm mb-14"
          style={{ color: "#5a5148", fontFamily: "var(--font-dm-serif)" }}
        >
          <span>{post.author}</span>
          <span className="flex gap-4">
            <span>{post.date}</span>
            <span style={{ color: "#c9a84c" }}>·</span>
            <span>{post.readingTime}</span>
          </span>
        </div>

        {/* Content */}
        <div style={{ fontFamily: "var(--font-dm-serif)", fontSize: "1.0625rem" }}>
          {post.content.map((block, i) => {
            if (block.type === "lede") {
              return (
                <p
                  key={i}
                  className="text-xl italic leading-[1.8] mb-10"
                  style={{ color: "#1a1612" }}
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "section") {
              return (
                <section key={i} className="mb-10">
                  <h2
                    className="text-2xl mb-5 leading-snug"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontWeight: 600,
                      color: "#1a1612",
                    }}
                  >
                    {block.heading}
                  </h2>
                  {renderBody(block.body)}
                </section>
              );
            }

            if (block.type === "pullquote") {
              return (
                <blockquote
                  key={i}
                  className="my-12 py-2 pl-6 pr-4"
                  style={{ borderLeft: "3px solid #c9a84c" }}
                >
                  <p
                    className="text-xl italic leading-[1.75]"
                    style={{ fontFamily: "var(--font-dm-serif)", color: "#1a1612" }}
                  >
                    {block.text}
                  </p>
                </blockquote>
              );
            }

            if (block.type === "closing") {
              return (
                <div key={i}>
                  <div className="my-12 flex justify-center">
                    <span style={{ color: "#c9a84c", letterSpacing: "0.5em", fontSize: "0.7rem" }}>
                      ✦ ✦ ✦
                    </span>
                  </div>
                  <p className="leading-[1.85]" style={{ color: "#5a5148" }}>
                    {block.text}
                  </p>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Footer rule */}
        <div className="mt-20 pt-8" style={{ borderTop: "1px solid rgba(201,168,76,0.25)" }}>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: "#c9a84c", fontFamily: "var(--font-playfair)" }}
          >
            Weiting Liu · Staff SRE · Tokyo
          </p>
        </div>
      </article>
    </>
  );
}
