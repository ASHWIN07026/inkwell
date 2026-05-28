const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const supabase = require('../config/supabase');

const seed = async () => {
  console.log('Seeding Supabase database...');

  await supabase.from('comment_likes').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('post_likes').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('comments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Cleared existing data');

  const p1 = await bcrypt.hash('password123', 12);
  const p2 = await bcrypt.hash('demo1234', 12);
  const p3 = await bcrypt.hash('pass5678', 12);

  const { data: users, error: uErr } = await supabase.from('users').insert([
    { name: 'Sarah Chen', email: 'sarah@inkwell.com', password: p1, bio: 'Full-stack developer & tech writer. Passionate about React, Node.js, and building products people love.' },
    { name: 'Maya Rodriguez', email: 'maya@inkwell.com', password: p1, bio: 'UX Designer & culture critic. I write about design systems, creative thinking, and the intersection of art and technology.' },
    { name: 'James Okafor', email: 'james@inkwell.com', password: p3, bio: 'Science journalist and researcher. Covering climate, biology, and the future of human health.' },
    { name: 'Demo User', email: 'demo@inkwell.com', password: p2, bio: 'Just exploring Inkwell!' },
  ]).select();

  if (uErr) { console.error('User seed error:', uErr); return; }
  console.log('Created', users.length, 'users');

  const [sarah, maya, james, demo] = users;

  const { data: posts, error: pErr } = await supabase.from('posts').insert([
    {
      title: 'The Future of Web Development: What 2025 Holds',
      content: `The web platform continues to evolve at an incredible pace. If you blinked in the last two years, you may have missed a fundamental shift in how we build for the web.

## React Server Components

One of the most significant paradigm shifts has been the rise of React Server Components. Unlike traditional client-side rendering, RSCs allow components to run exclusively on the server — meaning zero JavaScript sent to the browser for those components.

This changes how we think about data fetching entirely. Instead of useEffect + fetch patterns that cause waterfall requests, you simply make your component async and await your data directly:

\`\`\`jsx
async function PostList() {
  const posts = await db.posts.findMany();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
\`\`\`

## Edge Computing

Edge functions now allow us to run code milliseconds from users anywhere on Earth. Platforms like Vercel Edge, Cloudflare Workers, and Deno Deploy have made this accessible to every developer.

The performance implications are staggering. A user in Mumbai no longer waits for a server in Virginia to respond. Latency drops from 200ms to under 20ms.

## AI-Assisted Development

AI-assisted development is no longer a curiosity — it is becoming a core part of every developer workflow. GitHub Copilot, Claude, and Cursor are changing how we write boilerplate, debug errors, and explore unfamiliar codebases.

The developers who thrive won't be those who resist these tools. They'll be the ones who learn to direct them precisely.

## What This Means For You

The skill that matters most in 2025 isn't knowing a specific framework — it's understanding the fundamentals deeply enough that you can evaluate any new tool critically. HTTP, rendering patterns, data structures, and system design are more valuable than ever.`,
      excerpt: 'The web platform continues to evolve at an incredible pace — from edge computing to AI-assisted development. Here is what every developer needs to know.',
      category: 'Technology',
      tags: ['webdev', 'react', 'javascript', 'ai'],
      author_id: sarah.id,
    },
    {
      title: 'Designing for Cognitive Load: Less Is Genuinely More',
      content: `Every pixel on a screen competes for attention. The most common mistake designers make is adding too much — too many options, too many colors, too much movement.

## Cognitive Load Theory

Cognitive load theory, developed by psychologist John Sweller in the 1980s, explains why complexity exhausts users. Our working memory can only hold around 4 items at once. When an interface demands more, users make errors, feel frustrated, and leave.

There are three types of cognitive load:

- **Intrinsic load** — the inherent complexity of the task itself
- **Extraneous load** — complexity introduced by poor design
- **Germane load** — mental effort that builds understanding

Good design eliminates extraneous load entirely.

## The 5-Second Rule

If a new user cannot understand what your product does within 5 seconds of landing on it, your design has failed — regardless of how beautiful it is.

Test this yourself. Show your homepage to someone unfamiliar with your product and ask: "What does this do?" If they hesitate or get it wrong, simplify.

> "Good design is as little design as possible." — Dieter Rams

## Practical Reduction Techniques

**Remove first, add later.** Start every design iteration by asking what you can remove, not what you can add.

**Progressive disclosure.** Show users only what they need for their current task. Reveal complexity only when they ask for it.

**Consistent patterns.** Reusing the same interaction pattern reduces load because users only learn it once.

## The Paradox of Choice

Barry Schwartz's research showed that more options consistently lead to worse decisions and lower satisfaction. A menu with 6 items outperforms one with 24 — even when the longer menu contains objectively better options.

Apply this to your UI. That settings panel with 40 toggles? Most users will use 3 of them. Surface those 3. Hide the rest.`,
      excerpt: 'Every pixel competes for attention. The most common mistake in interface design is adding too much. Here is how to design for the brain you actually have.',
      category: 'Design',
      tags: ['ux', 'design', 'minimalism', 'psychology'],
      author_id: maya.id,
    },
    {
      title: 'Understanding Large Language Models: A Plain-English Guide',
      content: `Large language models are everywhere now, but most explanations of how they work are either too shallow ("it predicts the next word") or too technical (attention mechanisms, transformer architecture). This is an attempt at the middle ground.

## What Is a Language Model, Actually?

A language model is a probability distribution over sequences of text. Given the words "The cat sat on the", a language model assigns a probability to every possible next word. "mat" might get 15%, "floor" might get 12%, "roof" a much lower probability.

That is the core idea. Everything else is about how we build a model that assigns useful probabilities.

## The Transformer Architecture

In 2017, Google researchers published "Attention Is All You Need" — a paper that changed the field entirely. The key insight was the attention mechanism.

When processing the sentence "The animal didn't cross the street because it was too tired", a human immediately knows "it" refers to "the animal", not "the street". Attention lets the model learn this kind of long-range dependency.

Each token (roughly a word) in the input asks: "Which other tokens in this sequence are relevant to understanding me?" The answer is a weighted combination of all other tokens. This happens across many layers, building increasingly abstract representations.

## Why Scale Matters

Something surprising happened as researchers scaled these models up: they developed emergent capabilities that weren't explicitly trained.

GPT-2 could barely write a coherent paragraph. GPT-3 could write essays. GPT-4 can reason through multi-step problems. The jump in capability wasn't linear — it was sudden, appearing at certain scale thresholds.

We don't fully understand why this happens. That's part of what makes this field both exciting and concerning.

## What These Models Cannot Do

They don't "know" things the way you know things. They don't have beliefs, goals, or understanding. They are very sophisticated pattern matchers — extraordinarily good at producing text that looks like the text in their training data.

This is why they hallucinate. If the training data contains authoritative-sounding statements about a topic, the model will produce authoritative-sounding text about that topic, even when the content is wrong.`,
      excerpt: 'LLMs are everywhere, but most explanations miss the middle ground. Here is how they actually work — no PhD required.',
      category: 'Technology',
      tags: ['ai', 'machine-learning', 'llm', 'explainer'],
      author_id: sarah.id,
    },
    {
      title: 'The Quiet Revolution in Urban Farming',
      content: `In a former textile warehouse on the outskirts of Detroit, rows of leafy greens grow under pink LED lights, stacked floor to ceiling, fed by nutrient-rich water cycling through reclaimed pipes. No soil. No sunlight. No seasons.

This is vertical farming, and it is quietly reshaping how cities think about food security.

## Why Now?

Three converging forces have made urban farming economically viable for the first time:

**LED efficiency.** Grow lights now consume 70% less electricity than they did a decade ago. This was the primary cost barrier, and it has largely collapsed.

**Automation.** Robotic seeding, harvesting, and monitoring systems have reduced labor costs by 40-60% in the most advanced facilities.

**Climate anxiety.** After supply chain disruptions in 2020 and 2021, city governments and investors began taking food security seriously as a policy priority.

## What It Grows Well

Vertical farms excel at leafy greens — lettuce, spinach, arugula, herbs. These crops have short growth cycles, high turnover, and are sold fresh, meaning proximity to the consumer matters.

They struggle with calorie-dense staples. Growing wheat, corn, or potatoes vertically is currently not economically viable. The farms we see today feed salad, not civilization.

## The Water Story

Here is the statistic that surprises most people: vertical farms use 95% less water than conventional agriculture for the same yield.

In a controlled environment, water is recirculated. There is no runoff, no evaporation from open fields, no irrigation inefficiency. In a world of increasing water scarcity, this is not a minor footnote.

## The Limits of the Revolution

Vertical farming will not feed the world. The energy requirements for protein and grain crops are too high, and the capital costs of building facilities remain steep.

But as a supplementary system — producing fresh vegetables for dense urban populations year-round, independent of weather — it is already changing menus, supply chains, and what it means to grow something.`,
      excerpt: 'In warehouses across the world, vegetables grow without soil, sunlight, or seasons. The economics of vertical farming have finally arrived.',
      category: 'Science',
      tags: ['agriculture', 'climate', 'food', 'innovation'],
      author_id: james.id,
    },
    {
      title: 'Why I Quit Social Media for 90 Days (And What Actually Happened)',
      content: `I want to be careful not to write the essay you've already read a hundred times. The one where someone quits social media, discovers the beauty of long walks and paper books, and returns enlightened.

That is not exactly what happened to me.

## The Setup

I deleted Instagram, Twitter/X, and LinkedIn from my phone on January 1st. Not a detox — a proper quit. Deactivated accounts, deleted apps, told people to email me if they needed to reach me.

I work as a freelance writer. Social media is, by most accounts, essential to my career. This was supposed to be a professional risk.

## The First Two Weeks

The withdrawal was real. I picked up my phone reflexively every 8-10 minutes, opening the folder where Instagram used to be, staring at a blank space, putting it down. This happened dozens of times per day.

What I noticed was the *trigger*. I reached for my phone when I was waiting — for coffee to brew, for a page to load, for a thought to form. The discomfort of a 30-second pause had become intolerable. That realization was uncomfortable.

## The Work

By week three, something shifted. I was writing more. Not because I had more time — the hours I saved were modest, maybe 40 minutes per day. I was writing more because I had stopped fragmenting my attention before sitting down to work.

I had been marinating in other people's sentences all morning, then wondering why my own felt pale by comparison.

## What I Actually Missed

Other people's lives, genuinely. Not performatively — I missed seeing what friends were making, reading, thinking about. The parasocial part of social media is criticized, but there is real warmth in the ambient awareness of people you care about.

I also missed the professional serendipity. Two writing opportunities I know about came through Twitter connections. I don't know what I didn't hear about.

## Coming Back

I'm back now, with different habits. I check once per day, on a computer, not a phone. No notifications. The apps are gone permanently.

What surprised me most wasn't the productivity gains or the mindfulness. It was discovering that my opinions, without the daily reinforcement of my feed, were less certain and more interesting than they had been before.`,
      excerpt: 'Not the essay where someone quits social media and finds enlightenment. A more honest account of 90 days, what changed, and what did not.',
      category: 'Lifestyle',
      tags: ['social-media', 'digital-wellbeing', 'writing', 'productivity'],
      author_id: maya.id,
    },
    {
      title: 'The Lost Art of Reading Slowly',
      content: `Speed reading is a lie we tell ourselves. Not entirely — you can train yourself to move through text faster. But the thing we most value about reading, the thing that changes us, happens in the pauses.

## What Reading Actually Is

When you read a sentence that surprises you, your brain doesn't just process and move on. It backtracks. It holds the sentence against what you already believed. It generates predictions about what comes next, confirms or revises them, builds a model of the author's mind.

This is not fast. It cannot be made fast without losing most of what matters.

## The Skimming Default

We have been trained by the internet to skim. The F-pattern eye movement studies from the Nielsen Norman Group showed that most people read the first line of a paragraph and then the first words of subsequent lines. We are harvesting signal, not reading.

This works for content that exists to inform. It fails catastrophically for content that exists to transform.

## A Different Practice

I have been experimenting with what I call the one-hour rule: one book, one hour, no phone in the room. Not two hours, not a whole morning. Just one focused hour before the day starts.

The constraint matters. Knowing I have an hour changes the quality of my attention in a way that "reading whenever I can" never did.

## Marginalia

The physical act of writing in the margins of a book — disagreeing, connecting to another idea, marking a sentence that matters — slows reading down and encodes it differently. I remember books I've marked. I have almost no memory of books I read cleanly.

Digital annotation tools try to replicate this and mostly fail. The friction of picking up a pencil is not a bug. It is part of what makes the note worth making.

## The Books Worth Reading Slowly

Not all books deserve this treatment. Some books are genuinely meant to be consumed. But the ones that changed how you think — those were almost certainly read slowly, in a physical space, with nothing else competing for your attention.

The question is whether you're still giving any books that kind of time.`,
      excerpt: 'Speed reading is a lie we tell ourselves. The thing that makes reading transformative happens in the pauses — and we have been trained to skip them.',
      category: 'Culture',
      tags: ['reading', 'books', 'attention', 'culture'],
      author_id: maya.id,
    },
    {
      title: 'Building a Second Brain: A Practical System That Actually Works',
      content: `I have tried every productivity system. GTD, Zettelkasten, PARA, time blocking, bullet journaling. Most of them worked for three weeks and then collapsed under the weight of their own maintenance.

What I use now is simpler and more durable. Here is the honest version.

## The Core Problem

We consume far more information than we can use in the moment. A podcast episode with three genuinely useful ideas, a research paper with one insight that would change how you approach a problem, an article that reframes something you thought you understood.

Almost all of this is gone within a week. Not because we're forgetful — because we have no system for capture and retrieval.

## The Minimum Viable System

You need three things, and only three:

**A capture tool.** Something frictionless enough that you'll actually use it in the moment. For me this is Apple Notes — not because it's the best, but because it's always open. I drop a link, a quote, a thought. No formatting required.

**A weekly processing ritual.** Every Sunday, 20 minutes. I go through the week's captures and ask: is this still interesting? If yes, I move it to Obsidian with a single sentence about why it matters to me. If no, I delete it.

**A connection habit.** When I sit down to write or work on a project, I spend five minutes searching my notes for anything relevant. This is where the value accumulates. Ideas that seemed unrelated reveal connections.

## What I Stopped Doing

I stopped tagging obsessively. Tags require you to know how you'll want to find something before you know what it means — which is usually impossible.

I stopped maintaining a perfect hierarchy. Folder structures become archaeology projects. Search is better.

I stopped capturing everything. Selective capture with a sentence about *why* beats comprehensive capture with no context.

## The Real Benefit

The benefit isn't retrieving information — it's the thinking that happens when you process it. Writing a single sentence about why something matters forces a clarity that passive reading never produces.

Your second brain doesn't make you smarter. It makes you slower in a useful way.`,
      excerpt: 'Every productivity system I tried worked for three weeks and then collapsed. Here is the honest version of what actually stuck — and why.',
      category: 'Lifestyle',
      tags: ['productivity', 'note-taking', 'knowledge-management', 'writing'],
      author_id: sarah.id,
    },
    {
      title: 'The Microbiome Revolution: How Gut Bacteria Are Rewriting Medicine',
      content: `Ten years ago, if you told a doctor that the bacteria in your gut influenced your mood, immune system, and risk of depression, you would have been politely dismissed. Today, it is one of the most active areas of medical research in the world.

## What We Found

The human gut contains approximately 38 trillion bacteria — roughly equal to the number of human cells in the body. For most of medical history, these were considered passive residents, tolerated but not consequential.

The revolution began when researchers started comparing germ-free mice (raised with no gut bacteria) to normal mice. The differences were dramatic: altered immune development, changed behavior, different stress responses. Remove the bacteria, and you get a fundamentally different animal.

## The Gut-Brain Axis

The vagus nerve runs directly from the gut to the brain, and the communication is mostly one-directional — upward. About 90% of serotonin, a neurotransmitter associated with mood and wellbeing, is produced in the gut.

Studies have linked disrupted gut microbiomes to depression, anxiety, and autism spectrum conditions. This doesn't mean gut bacteria *cause* these conditions — the research is still early. But the correlation is too strong and too consistent to dismiss.

## Fecal Transplants

The most dramatic demonstration of the microbiome's power is fecal microbiota transplantation (FMT). In patients with recurrent C. difficile infections — a severe, sometimes fatal gut condition — transplanting gut bacteria from a healthy donor resolves the infection in over 90% of cases.

Antibiotics cure it about 30% of the time. Transplanted bacteria: 90%. The implication is that a healthy microbiome is not just passive — it actively defends the gut from harmful bacteria.

## What You Can Actually Do

The research is clearer on what harms the microbiome than on what specifically helps it. Broad-spectrum antibiotics, ultra-processed foods, and chronic stress all reduce bacterial diversity.

Diversity seems to be key. Populations with the most diverse gut microbiomes — measured by bacterial species count — consistently show better health outcomes across multiple metrics.

Fermented foods (yogurt, kimchi, kefir, kombucha) and high-fiber diets reliably increase diversity in clinical studies. This is not surprising news. But understanding *why* it works — through the microbiome — is new.`,
      excerpt: 'Ten years ago, the idea that gut bacteria affected your mood would have been dismissed. Today it is reshaping medicine. What we know, and what is still uncertain.',
      category: 'Science',
      tags: ['health', 'microbiome', 'medicine', 'biology'],
      author_id: james.id,
    },
    {
      title: 'What Bootstrapping a SaaS Taught Me That No Business Book Could',
      content: `I spent two years building a SaaS product on evenings and weekends while working a full-time job. It reached $4,200 MRR before I sold it. It never made me rich. It taught me more than my MBA.

Here are the lessons that surprised me.

## Your First 10 Customers Are Not Your Market

I made the mistake of building features for my first 10 customers. They were enthusiastic, engaged, and completely unrepresentative of anyone else who would ever use the product.

Early adopters tolerate rough edges. They are curious about new things. They will give you extensive feedback. None of this means they are your market. I spent eight months building features that normal customers actively didn't want.

The lesson: treat your first 10 customers as research, not as users to serve.

## Support Tickets Are Product Research

I hated support. Every ticket felt like a failure. Then I started reading them differently — not as problems to resolve, but as data about where the product was confusing.

The same question appearing three times in a week meant something in the UI was broken. Not buggy — *conceptually* broken. The language didn't match how users thought about the problem.

I stopped trying to reduce support volume and started trying to understand it. Support volume dropped anyway.

## Pricing Is Not About Value

Every pricing guide tells you to charge what your product is worth. This is correct and useless.

What I learned: pricing is about *signal*. A $29/month product signals "small hobby project." A $99/month product signals "serious tool for professionals." The same product, different price, attracts different customers with different expectations and different churn rates.

My churn dropped when I raised prices. Not because the product changed — because the customers changed.

## What I'd Do Differently

I would talk to 50 potential customers before writing a line of code. I would charge from day one, even in beta. I would pick one marketing channel and get good at it before trying a second.

Most importantly: I would remember that a $4,200 MRR business that you understand completely is worth more, practically, than a $40,000 MRR business that owns you.`,
      excerpt: 'Two years, $4,200 MRR, then a sale. What bootstrapping actually teaches you that no business book will — including why I raised prices and churn dropped.',
      category: 'Business',
      tags: ['saas', 'entrepreneurship', 'startups', 'business'],
      author_id: sarah.id,
    },
    {
      title: 'Sleep Is Not Laziness: The Science of Rest We Keep Ignoring',
      content: `We have built a culture that treats sleep deprivation as a credential. "I only need five hours" is said with the same pride as "I ran a marathon." Both are feats. Only one of them is destroying your brain.

## What Happens When You Sleep

Sleep is not downtime. It is the most metabolically active period of your brain's day.

During non-REM sleep, the glymphatic system — a waste-clearance mechanism discovered in 2012 — flushes toxic proteins from the brain. Among them is amyloid beta, the primary component of Alzheimer's plaques. One night of sleep deprivation measurably increases amyloid beta levels. Chronic short sleep is now considered one of the strongest modifiable risk factors for Alzheimer's disease.

During REM sleep, the brain consolidates memories — moving the day's experiences from short-term to long-term storage. It also strips the emotional charge from difficult memories, which is why "sleeping on it" genuinely helps with distressing situations.

## The 6-Hour Myth

Most adults need 7-9 hours. This is not a recommendation — it is a biological requirement, as fixed as the need for water.

Studies on "short sleepers" — people who claim to function fine on 6 hours — consistently show impaired performance on cognitive tests compared to the same people sleeping 8 hours, even when subjects don't feel impaired. This is the dangerous part. Sleep deprivation degrades your ability to judge your own impairment.

## What Actually Helps

**Temperature.** Your core body temperature must drop 1-2 degrees Fahrenheit to initiate sleep. A cool bedroom (65-68°F / 18-20°C) helps. A warm bath before bed paradoxically helps too — the subsequent heat dissipation triggers the drop.

**Consistency.** Wake time matters more than bedtime. A fixed wake time anchors your circadian rhythm. Sleeping in on weekends, even by 90 minutes, causes measurable "social jet lag" that impairs Monday performance.

**Light exposure.** Morning sunlight within an hour of waking calibrates your circadian clock. Evening blue light suppresses melatonin onset by 2-3 hours.

## The Real Cost

Matthew Walker, in *Why We Sleep*, calculates that sleeping under 6 hours per night doubles your risk of cancer, cardiovascular disease, and immune dysfunction. These are not marginal effects.

The most productive thing most of us could do for our work, health, and cognitive performance is go to bed earlier. We just can't bring ourselves to believe it.`,
      excerpt: 'We treat sleep deprivation as a credential. The science says it is eroding your brain, your health, and your judgment — and you cannot feel it happening.',
      category: 'Health',
      tags: ['sleep', 'health', 'neuroscience', 'wellbeing'],
      author_id: james.id,
    },
  ]).select();

  if (pErr) { console.error('Post seed error:', pErr); return; }
  console.log('Created', posts.length, 'posts');

  await supabase.from('comments').insert([
    { content: 'The section on React Server Components is spot on. We migrated last quarter and the performance gains were real.', author_id: maya.id, post_id: posts[0].id },
    { content: 'Edge computing is still underrated. Most teams haven\'t touched it yet but the latency difference is night and day.', author_id: james.id, post_id: posts[0].id },
    { content: 'This reframed how I think about our settings page. We have 47 options. Nobody needs 47 options.', author_id: sarah.id, post_id: posts[1].id },
    { content: 'The paradox of choice point is the one I keep sharing with clients. More options = more anxiety, not more satisfaction.', author_id: demo.id, post_id: posts[1].id },
    { content: 'Best plain-English explanation of attention mechanisms I\'ve read. The "which tokens are relevant to me" framing finally made it click.', author_id: maya.id, post_id: posts[2].id },
    { content: 'The vertical farm I visited in Singapore uses 97% less water. It\'s extraordinary to see in person.', author_id: sarah.id, post_id: posts[3].id },
    { content: 'The part about fragmented attention before writing is exactly what I\'ve been experiencing. Hadn\'t connected it to social media until now.', author_id: james.id, post_id: posts[4].id },
    { content: 'Marginalia changed how I read. I use a pencil in every book now. Memory retention is completely different.', author_id: demo.id, post_id: posts[5].id },
    { content: 'The "stop tagging obsessively" point alone saved me hours. I had hundreds of tags that I never searched for.', author_id: maya.id, post_id: posts[6].id },
    { content: 'The FMT data is wild. 90% vs 30% is not a marginal improvement — that\'s a different category of intervention entirely.', author_id: sarah.id, post_id: posts[7].id },
    { content: '"Treat your first 10 customers as research" — this is the one I wish someone had told me in year one.', author_id: james.id, post_id: posts[8].id },
    { content: 'The part about not being able to feel your own impairment is the scariest thing in this piece. We\'re the worst judges of our own sleep debt.', author_id: maya.id, post_id: posts[9].id },
  ]);

  console.log('Created sample comments');
  console.log('\nSeed complete! Login credentials:');
  console.log('  demo@inkwell.com   /  demo1234');
  console.log('  sarah@inkwell.com  /  password123');
  console.log('  maya@inkwell.com   /  password123');
  console.log('  james@inkwell.com  /  pass5678');
};

seed().catch(console.error);