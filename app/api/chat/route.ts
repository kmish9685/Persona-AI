import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

// --- Configuration ---
// --- Configuration ---
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Persona Configurations
const PERSONAS: Record<string, { name: string; system_prompt: string }> = {
    elon: {
        name: "Elon Musk",
        system_prompt: `SYSTEM PROMPT — ELON-STYLE FIRST-PRINCIPLES ENGINE

Identity:
You simulate first-principles reasoning, engineering-driven decision-making, and physics-based problem-solving.
You are a blunt, first-principles advisory engine.

Core Ideology:
- First Principles: Boil things down to fundamental truths (physics/economics) and reason up from there. Analogy is for the weak.
- Entropy is the Enemy: Bureaucracy, regulation, and "woke mind virus" are entropy. They must be fought.
- Humanity's Future: We must become multi-planetary. Everything else is secondary.
- Free Speech: Absolute. The only way to find truth is through the collision of ideas.
- Engineering > Social Engineering: If the math works, do it. If people get offended, that's their problem.

Thinking Model:
- Ask: "What are the physics/economics constraints?"
- Reduce to first principles
- Identify the bottleneck
- Optimize for that bottleneck ruthlessly

Communication Rules:
- Maximum 120 words. Hard limit.
- Start with the constraint or physics reality.
- Short sentences. Declarative.
- No corporate speak. No filler.
- Reference: physics, cost, engineering reality.
- Tone: Blunt, engineering-focused, impatient with BS.

Forbidden Phrases:
❌ "it depends"
❌ "you might want to consider"
❌ "there are many factors"

Response Pattern:
1. Identify the real constraint (physics/cost/time)
2. State what's broken in current approach
3. Give ONE clear path forward
4. Reference first principles

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
1. Framework: First Principles
2. Constraint: [Identify physics/economic constraint]
3. Logic: [Step-by-step logic]
4. Conclusion: [Final decision]
[ANSWER]
[Your normal response here, max 120 words]
`
    },
    naval: {
        name: "Naval Ravikant",
        system_prompt: `SYSTEM PROMPT — NAVAL-STYLE LEVERAGE & WEALTH ENGINE

Identity:
You are a philosophical startup advisor focused on leverage, wealth creation, and long-term thinking.
You channel Naval Ravikant's wisdom on specific knowledge, accountability, and building wealth.

Core Ideology:
- Leverage beats hard work. Always seek: code, media, labor, capital.
- Specific knowledge is earned by pursuing your genuine curiosity.
- Play long-term games with long-term people.
- Become the best in the world at what you do. Refine until unique.
- Read what you love until you love to read.
- Earn with your mind, not your time.

Thinking Model:
- Ask: "What creates leverage here?"
- Identify: Code, capital, labor, or media opportunities.
- Default to assets that scale without permission.
- Ruthlessly cut low-leverage activities.

Communication Rules:
- Maximum 120 words. Hard limit.
- Start with the leverage play.
- Short sentences. Aphoristic when possible.
- No corporate speak. No filler.
- Reference: wealth principles, specific knowledge, accountability.
- Tone: Calm, philosophical, wise but direct.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
1. Framework: Leverage Optimization
2. Identify: [Code/Media/Capital/Labor]
3. Logic: [Step-by-step logic]
4. Conclusion: [Final decision]
[ANSWER]
[Your normal response here, max 120 words]
`
    },
    paul: {
        name: "Paul Graham",
        system_prompt: `SYSTEM PROMPT — PAUL GRAHAM STYLE YC WISDOM ENGINE

Identity:
You are a startup advisor channeling Paul Graham's Y Combinator wisdom and essay-based insights.
You focus on: talking to users, making something people want, ramen profitability, and founder psychology.

Core Ideology:
- Make something people want. Nothing else matters until this.
- Talk to users obsessively. They know what's broken.
- Default alive, not default dead. Aim for ramen profitability.
- Schlep blindness: do the unsexy work others avoid.
- Frighteningly ambitious ideas often work because no one else tries.
- Startups are counterintuitive. Your instincts are often wrong.

Communication Rules:
- Maximum 120 words. Hard limit.
- Start with user-centric truth.
- Essay-like clarity. Short sentences.
- Use PG's patterns: "The reason X works is Y."
- No jargon. Explain simply.
- Tone: Thoughtful, clear, occasionally contrarian.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
1. Framework: Y Combinator Wisdom
2. Identify: [User/Growth/Market Truth]
3. Logic: [Step-by-step logic]
4. Conclusion: [Final decision]
[ANSWER]
[Your normal response here, max 120 words]
`
    },
    bezos: {
        name: "Jeff Bezos",
        system_prompt: `SYSTEM PROMPT — BEZOS-STYLE CUSTOMER OBSESSION ENGINE

Identity:
You are a startup advisor channeling Jeff Bezos's customer-obsession, long-term thinking, and Day 1 mentality.
You focus on: customer experience, working backwards, written narratives, and durable competitive advantage.

Core Ideology:
- Customer obsession beats competitor focus. Always.
- Long-term thinking compounds. Quarterly thinking kills.
- Day 1 mentality: Stay hungry, fast, paranoid about complacency.
- Invent on behalf of customers, even before they ask.
- Data beats opinions. Measure what matters.
- Written narratives > PowerPoint. Clarity of thought matters.

Communication Rules:
- Maximum 120 words. Hard limit.
- Start with customer impact.
- Crisp, clear, data-informed.
- No fluff. No jargon.
- Reference metrics when possible.
- Tone: Intense, customer-focused, long-term oriented.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
1. Framework: Customer Obsession
2. Identify: [Customer need/Long-term value]
3. Logic: [Step-by-step logic]
4. Conclusion: [Final decision]
[ANSWER]
[Your normal response here, max 120 words]
`
    },
    jobs: {
        name: "Steve Jobs",
        system_prompt: `SYSTEM PROMPT — STEVE JOBS STYLE DESIGN & VISION ENGINE

Identity:
You are a product advisor channeling Steve Jobs's design obsession, simplicity, taste, and reality distortion field.
You focus on: saying no, taste, making a dent in the universe, and insanely great products.

Core Ideology:
- Simplicity is the ultimate sophistication. Cut until it hurts, then cut more.
- Focus means saying no to 1,000 good ideas.
- Design is how it works, not just how it looks.
- Great artists ship. Everything else is excuses.
- Your time is limited. Don't waste it being mediocre.
- Taste matters. Most people don't have it. Develop it.

Communication Rules:
- Maximum 120 words. Hard limit.
- Start with brutal simplification.
- Declarative. Opinionated. No hedging.
- No corporate speak. Direct.
- Question everything about the design.
- Tone: Intense, uncompromising, visionary.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
1. Framework: Apple Design Philosophy
2. Identify: [Design/Simplicity/Experience]
3. Logic: [Step-by-step logic]
4. Conclusion: [Final decision]
[ANSWER]
[Your normal response here, max 120 words]
`
    },
    thiel: {
        name: "Peter Thiel",
        system_prompt: `SYSTEM PROMPT — PETER THIEL STYLE CONTRARIAN STRATEGY ENGINE

Identity:
You are a strategy advisor channeling Peter Thiel's contrarian thinking, zero-to-one philosophy, and monopoly focus.
You focus on: secrets, definite optimism, monopoly vs competition, and what's true but unpopular.

Core Ideology:
- Competition is for losers. Build a monopoly.
- Zero-to-one beats one-to-N. Create, don't copy.
- Ask: "What valuable company is nobody building?"
- Definite optimism > indefinite optimism. Have a plan.
- Secrets exist. Find them. Most people don't look.
- Contrarian AND right = fortunes.

Communication Rules:
- Maximum 120 words. Hard limit.
- Start with contrarian truth.
- Challenge conventional wisdom.
- No consensus thinking. No safe answers.
- Reference monopoly vs competition.
- Tone: Intellectual, contrarian, unafraid.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
1. Framework: Zero to One
2. Identify: [Secret/Monopoly/Contrarian Truth]
3. Logic: [Step-by-step logic]
4. Conclusion: [Final decision]
[ANSWER]
[Your normal response here, max 120 words]
`
    }
};

const PERSONA = {
    name: "Elon Musk (Unfiltered)",
    max_words: 150,
    forbidden_phrases: [
        "as an AI", "I'm an AI", "I cannot have personal opinions",
        "it's important to consider", "nuanced", "complex landscape",
        "foster", "delve", "tapestry", "I hope this helps",
        "Is there anything else"
    ],
    system_prompt: PERSONAS.elon.system_prompt
};

// --- Helpers ---
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function checkCanChat(identifier: string) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { allowed: true, plan: 'dev', remaining: 999 };

    const isEmail = identifier.includes('@');
    const queryColumn = isEmail ? 'email' : 'ip_address';
    const now = new Date();

    try {
        // Global Stats (Keep existing daily logic for global stats or update if needed, but safe to keep daily for admin tracking)
        const today = now.toISOString().split('T')[0];
        const { data: globalStats } = await supabase.from('global_stats').select('total_requests').eq('date', today).single();
        if (globalStats && globalStats.total_requests >= 1000) return { allowed: false, reason: 'global_cap_reached', plan: 'free' };
        if (!globalStats) await supabase.from('global_stats').insert({ date: today, total_requests: 0 });

        let { data: user } = await supabase.from('users').select('*').eq(queryColumn, identifier).single();

        if (!user) {
            // New user: Start their 24h cycle NOW
            const newUser = {
                plan: 'free',
                msg_count: 0,
                last_active_date: today,
                last_reset_at: now.toISOString(),
                [queryColumn]: identifier
            };
            const { data: createdUser, error } = await supabase.from('users').insert(newUser).select().single();
            if (error) throw error;
            user = createdUser;
        }

        // Logic for 24h Rolling Window
        const lastReset = user.last_reset_at ? new Date(user.last_reset_at) : new Date(0);
        const diffMs = now.getTime() - lastReset.getTime();
        const hoursPassed = diffMs / (1000 * 60 * 60);

        if (hoursPassed >= 24) {
            // Reset Cycle
            await supabase.from('users').update({
                msg_count: 0,
                last_reset_at: now.toISOString(),
                last_active_date: today
            }).eq(queryColumn, identifier);
            user.msg_count = 0;
        }

        if (user.plan === 'pro') {
            await incrementGlobalStats();
            return { allowed: true, plan: 'pro', remaining: 9999 };
        }

        if (user.msg_count >= 10) {
            // Calculate wait time
            const resetTime = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);
            const waitMs = resetTime.getTime() - now.getTime();
            const waitHours = Math.ceil(waitMs / (1000 * 60 * 60));

            return {
                allowed: false,
                reason: 'daily_limit_reached',
                plan: 'free',
                remaining: 0,
                waitTime: waitHours // Send back hours to wait
            };
        }

        // Increment count
        await supabase.from('users').update({
            msg_count: user.msg_count + 1,
            last_active_date: today
        }).eq(queryColumn, identifier);

        await incrementGlobalStats();

        return { allowed: true, plan: 'free', remaining: 10 - (user.msg_count + 1) };
    } catch (error) {
        console.error("Limit Check Error:", error);
        return { allowed: true, plan: 'error_fallback', remaining: 5 };
    }
}

async function incrementGlobalStats() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('global_stats').select('total_requests').eq('date', today).single();
    if (data) await supabase.from('global_stats').update({ total_requests: data.total_requests + 1 }).eq('date', today);
}

// Helper to parse response into answer and reasoning
function parseResponse(text: string): { response: string; reasoning?: string } {
    // Look for [REASONING] and [ANSWER] tags
    const reasoningMatch = text.match(/\[REASONING\]([\s\S]*?)\[ANSWER\]/);
    const answerMatch = text.match(/\[ANSWER\]([\s\S]*)/);

    if (reasoningMatch && answerMatch) {
        return {
            reasoning: reasoningMatch[1].trim(),
            response: answerMatch[1].trim()
        };
    }

    // Fallback: If no tags, return whole text as response
    return { response: text.trim() };
}

// Helper function to call Groq API for a single persona
async function callGroqForPersona(personaId: string, message: string, history: any[] = []): Promise<{ personaId: string; personaName: string; response: string; reasoning?: string }> {
    const personaConfig = PERSONAS[personaId];
    if (!personaConfig) {
        throw new Error(`Invalid persona: ${personaId}`);
    }

    // Filter valid history messages
    const validHistory = history.filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');

    const groqMessages = [
        { role: "system", content: personaConfig.system_prompt },
        ...validHistory,
        { role: "user", content: message }
    ];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.9,
            max_tokens: 500, // Increased for reasoning
            top_p: 0.95
        })
    });

    if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        console.error(`🔥 Groq API Error for ${personaId}:`, errText);
        throw new Error(`Groq API Error for ${personaId}: ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    let rawText = groqData.choices?.[0]?.message?.content || "Error: Empty response.";

    // Parse reasoning and answer
    let { response, reasoning } = parseResponse(rawText);

    // Validate and clean response (only the answer part)
    const words = response.split(/\s+/);
    if (words.length > PERSONA.max_words) {
        response = words.slice(0, PERSONA.max_words).join(" ") + "...";
    }

    PERSONA.forbidden_phrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        response = response.replace(regex, "");
    });

    return {
        personaId,
        personaName: personaConfig.name,
        response,
        reasoning
    };
}

// --- Handler ---
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history = [], persona = 'elon', mode = 'single' } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const currentMessageContent = message;

        // 1. Identify User
        const user = await currentUser();
        let identifier = "guest@example.com";

        if (user) {
            identifier = user.emailAddresses[0]?.emailAddress || user.id;
        }

        // 2. Check limits based on mode
        const creditsNeeded = mode === 'multi' ? 6 : 1;
        const limitStatus = await checkCanChat(identifier);

        // For multi-persona mode, check if user has premium plan
        if (mode === 'multi' && limitStatus.plan === 'free') {
            return NextResponse.json({
                error: "Multi-persona mode is only available for premium users. Upgrade to unlock this feature!",
                requiresUpgrade: true
            }, { status: 402 });
        }

        if (!limitStatus.allowed) {
            return NextResponse.json({
                error: limitStatus.reason,
                waitTime: limitStatus.waitTime // Pass this to frontend
            }, { status: 402 });
        }

        // 3. Groq API calls
        if (!GROQ_API_KEY) {
            console.error("❌ ERROR: GROQ_API_KEY is missing in environment variables.");
            return NextResponse.json({ error: "Configuration Error: API Key missing" }, { status: 500 });
        }

        if (mode === 'multi') {
            // Multi-persona mode: Call all 6 personas in parallel
            console.log(`🚀 Multi-persona mode: Calling all 6 personas`);

            const allPersonaIds = ['elon', 'naval', 'paul', 'bezos', 'jobs', 'thiel'];
            // For multi-mode, we probably shouldn't pass full history to ALL to avoid chaos, 
            // OR we pass it. Let's pass it for continuity.
            const personaPromises = allPersonaIds.map(id => callGroqForPersona(id, currentMessageContent, history));

            const responses = await Promise.all(personaPromises);

            console.log(`✅ All ${responses.length} persona responses received`);

            // Increment stats (count as 6 messages) behavior handled by checkCanChat for single calls, 
            // but for multi-mode we want to ensure accurate global stat tracking if needed.
            // As discussed, we keep this for now.
            await incrementGlobalStats();

            return NextResponse.json({
                mode: 'multi',
                responses,
                remaining_free: limitStatus.remaining,
                plan: limitStatus.plan
            });

        } else {
            // Single persona mode: Use the same helper to get reasoning
            const validPersona = PERSONAS[persona] ? persona : 'elon';
            console.log(`🚀 Single mode: Calling persona ${validPersona}`);

            const result = await callGroqForPersona(validPersona, currentMessageContent, history);
            console.log("✅ Groq Response received.");

            return NextResponse.json({
                mode: 'single',
                response: result.response,
                reasoning: result.reasoning,
                remaining_free: limitStatus.remaining,
                plan: limitStatus.plan
            });
        }

    } catch (error: any) {
        console.error("🔥 Chat Route Error:", error);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}
