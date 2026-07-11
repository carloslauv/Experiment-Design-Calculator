export type TrafficLevel = "high" | "medium" | "low" | "minimal";

export interface MetricType {
  id: string;
  label: string;
  description: string;
  baselineRate: string; // percentage string e.g. "5"
  mde: string;          // relative MDE % e.g. "15"
  power: string;
}

export interface BusinessModel {
  id: string;
  animal: string;
  name: string;
  acv: string;
  customersNeeded: string;
  tagline: string;
  trafficLevel: TrafficLevel;
  metrics: MetricType[];
  feasibilityNote?: string;
  alternatives?: Alternative[];
}

export interface Alternative {
  title: string;
  description: string;
}

export const BUSINESS_MODELS: BusinessModel[] = [
  {
    id: "flies",
    animal: "🪰",
    name: "Flies",
    acv: "<$1K",
    customersNeeded: "1M+",
    tagline: "B2C, consumer apps, mobile",
    trafficLevel: "high",
    metrics: [
      { id: "landing",   label: "Landing page conversion", description: "Visitor → signup or purchase",         baselineRate: "3",  mde: "15", power: "80" },
      { id: "cta",       label: "CTA click-through",       description: "Button or link click rate",            baselineRate: "8",  mde: "10", power: "80" },
      { id: "checkout",  label: "Checkout completion",      description: "Cart → completed purchase",           baselineRate: "65", mde: "5",  power: "80" },
      { id: "retention", label: "D7 retention",             description: "Users returning after 7 days",        baselineRate: "25", mde: "10", power: "80" },
      { id: "referral",  label: "Referral / share rate",    description: "Users who invite or share",           baselineRate: "5",  mde: "20", power: "80" },
      { id: "ad_ctr",    label: "Ad click-through",         description: "Impressions → ad click",              baselineRate: "2",  mde: "20", power: "80" },
    ],
  },
  {
    id: "mice",
    animal: "🐭",
    name: "Mice",
    acv: "$1K–$10K",
    customersNeeded: "100K",
    tagline: "SMB SaaS, self-serve, freemium",
    trafficLevel: "high",
    metrics: [
      { id: "trial",       label: "Trial signup rate",          description: "Visitor → free trial",               baselineRate: "6",  mde: "15", power: "80" },
      { id: "activation",  label: "First activation",           description: "Trial → completed first key action", baselineRate: "30", mde: "10", power: "80" },
      { id: "free2paid",   label: "Free-to-paid conversion",    description: "Trial → paying customer",            baselineRate: "8",  mde: "12", power: "80" },
      { id: "email_ctr",   label: "Email click-through",        description: "Emails sent → clicked",              baselineRate: "4",  mde: "15", power: "80" },
      { id: "pricing",     label: "Pricing page conversion",    description: "Pricing page view → trial start",    baselineRate: "5",  mde: "15", power: "80" },
    ],
  },
  {
    id: "rabbits",
    animal: "🐰",
    name: "Rabbits",
    acv: "$10K–$100K",
    customersNeeded: "10K",
    tagline: "Mid-market SaaS, inside sales",
    trafficLevel: "medium",
    metrics: [
      { id: "demo",       label: "Demo request rate",      description: "Visitor → booked demo",          baselineRate: "6",  mde: "15", power: "80" },
      { id: "trial2paid", label: "Trial-to-paid",          description: "Trial → contract signed",        baselineRate: "20", mde: "10", power: "80" },
      { id: "onboarding", label: "Onboarding completion",  description: "Signed → completed setup",       baselineRate: "40", mde: "8",  power: "80" },
      { id: "adoption",   label: "Feature adoption",       description: "Active users → using feature",   baselineRate: "25", mde: "10", power: "80" },
      { id: "expansion",  label: "Upsell / expansion",     description: "Customers → expanded contract",  baselineRate: "15", mde: "15", power: "80" },
    ],
  },
  {
    id: "deer",
    animal: "🦌",
    name: "Deer",
    acv: "$100K–$1M",
    customersNeeded: "1K",
    tagline: "Enterprise SaaS, field sales",
    trafficLevel: "low",
    feasibilityNote: "With ~1,000 target accounts, traditional web A/B testing is rarely viable. Focus on high-volume channels like email sequences and content. Use the feasibility check to see what's detectable with your real numbers.",
    metrics: [
      { id: "cold_reply",  label: "Cold email reply rate",   description: "Emails sent → reply",             baselineRate: "5",  mde: "20", power: "80" },
      { id: "content_dl",  label: "Content download rate",   description: "Page views → gated download",     baselineRate: "15", mde: "15", power: "80" },
      { id: "webinar",     label: "Webinar attendance",      description: "Invites → attended",              baselineRate: "30", mde: "15", power: "80" },
      { id: "mql_sql",     label: "MQL-to-SQL",              description: "Marketing qualified → sales qualified", baselineRate: "20", mde: "15", power: "80" },
      { id: "proposal",    label: "Proposal acceptance",     description: "Proposals sent → accepted",       baselineRate: "35", mde: "10", power: "80" },
    ],
    alternatives: [
      { title: "Sequential testing", description: "Stop the test early if results are already conclusive. Useful when sample size is a hard constraint — but requires pre-specified stopping rules." },
      { title: "Holdout groups", description: "Instead of 50/50, run 80/20 splits. You lose statistical power but expose fewer prospects to the experiment." },
      { title: "Win/Loss analysis", description: "Interview prospects who chose you vs. chose a competitor. Qualitative but highly actionable at low volume." },
      { title: "Cohort analysis", description: "Compare behavior across naturally occurring cohorts (e.g. deals closed in Q1 vs Q2 under different messaging) rather than running a controlled experiment." },
    ],
  },
  {
    id: "elephants",
    animal: "🐘",
    name: "Elephants",
    acv: "$1M+",
    customersNeeded: "~100",
    tagline: "Large enterprise, strategic accounts",
    trafficLevel: "minimal",
    feasibilityNote: "With ~100 target accounts, traditional A/B testing is essentially infeasible. Even your highest-volume channels rarely reach the hundreds of samples needed per arm. Use this calculator to understand the math — then rely on qualitative methods.",
    metrics: [
      { id: "exec_mtg",   label: "Executive meeting rate",   description: "Outreach attempts → booked meeting", baselineRate: "8",  mde: "25", power: "80" },
      { id: "rfp",        label: "RFP invitation rate",      description: "Target accounts → invited to RFP",   baselineRate: "20", mde: "25", power: "80" },
      { id: "email_reply", label: "Email reply rate",        description: "Emails sent → any reply",            baselineRate: "10", mde: "25", power: "80" },
    ],
    alternatives: [
      { title: "Reference & case study testing", description: "Test which case studies or references resonate in sales conversations. Track win rates across reps using different materials." },
      { title: "Message testing via ads", description: "Run paid ads targeting lookalike enterprise personas to test messaging. Not a direct product experiment, but lets you validate copy at scale." },
      { title: "Win/Loss interviews", description: "Structured interviews with every won and lost deal. The highest signal-to-noise method at this scale." },
      { title: "Bandit algorithms", description: "Use multi-armed bandit methods instead of fixed A/B splits. They shift traffic toward winning variants in real time, reducing waste on a small pool." },
      { title: "Advisory board validation", description: "Test positioning and product direction with 5–10 trusted design partners. Not statistically valid, but directionally reliable." },
    ],
  },
];

export function getModel(id: string): BusinessModel | undefined {
  return BUSINESS_MODELS.find(m => m.id === id);
}
