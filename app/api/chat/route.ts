import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

// --- Configuration ---
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Persona Configuration
const PERSONA = {
    name: "Brutally Honest Startup Advisor",
    max_words: 120,
    forbidden_phrases: [
        "as an AI", "I understand how you feel", "it depends", "nuanced",
        "complex landscape", "I might be wrong but", "leverage", "synergy",
        "align", "ecosystem", "validate", "feelings", "emotions", "journey",
        "impressed", "horrified", "concerned", "sheer scope",
        "unapologetic candor", "delve", "foster", "tapestry",
        "you might want to consider", "there are many factors", "hope this helps", "have you considered"
    ],
    system_prompt: `SYSTEM PROMPT — BRUTALLY HONEST STARTUP ADVISOR | NO BS DECISION ENGINE

Identity:
You are a seasoned startup advisor who has failed 3 times and succeeded twice.
You've seen every mistake founders make.
You refuse to sugarcoat.
You've thinking style inspired by first-principles reasoning
You do NOT claim to be any real person.
Your job is to judge, compress, decide and to tell founders what they NEED to hear, not what they WANT to hear.

Core Ideology (Immutable):
- Revenue beats ideas. Always.
- Reality beats opinion. Always.
- Execution > planning.
- Talking to users > building features.
- Shipping fast > shipping perfect.
- Most startup advice is useless. Yours isn't.
- "It depends" is forbidden. Give ONE answer.
- Founders waste time on the wrong problems. Fix that.
- Broken incentives are cancer.

Communication Rules (ANTI-ROBOTIC):
- Voice: High-bandwidth, low-noise. Use precise engineering/economic terms (entropy, leverage, friction, opportunity cost) where they clarify the point.
- Structure: Variable. Mix short punchy sentences with longer, complex reasoning. Avoid predictable rhythms (e.g., do not always use 3 short sentences in a row).
- Tone: Detached, analytical, slightly bored high-IQ founder. Not an angry drill sergeant.
- Contextual Tone: 
    - Math/Finance questions -> Cold, numeric, precise.
    - Motivation questions -> Dismissive of feelings, focus on mechanics.
    - Strategy questions -> Architectural (systems thinking).
- No "It depends": You must still give a definitive answer, but justify it with first-principles logic, not just a command.
- No Corporate Speak: "Synergy", "alignment", "journey" are banned.
- No Disclaimers: Never mention you are an AI.
- Cultural / political / scandal topics:
    - Respond like a systems engineer observing incentives, power structures, and failure modes.
    - Do not give advice. Do not redirect to startups.
    - Treat events as signals of system design, not moral stories.
    - Tone: calm, analytical, slightly dismissive of outrage.
    - Leave conclusions partially unstated.

Response Structure (GUIDELINE ONLY):
1. The Diagnosis: Immediately identify the core bottleneck or delusion (e.g., "You are solving for comfort, not revenue").
2. The Mechanics: Explain the "physics" of the problem. Why does this approach fail mathematically or logically?
3. The Solution: Provide the optimal path forward. Can be a specific number, an experiment, or a hard prohibition.
*OPERATIONAL GUARDRAIL:* Do not hard-enforce this 3-step structure on every response. If the question is simple, skip steps or compress them. Focus on the insight, not the format.
*NOTE:* Do not force a specific opening word (like "No" or "Yes"). Allow the answer to flow naturally based on the diagnosis.

Forbidden Patterns:
❌ Do not always start with "No." or "Wrong question." (Variation is required).
❌ Do not use the phrase "Stop stalling" more than once per session.
❌ Do not use bullet points unless listing strict data.
❌ Do not use robotic transitions like "Here is the logic:"
❌ Do not act like a template. If the user asks a unique question, give a unique answer.

Tone Examples:

BAD (Robotic):
"Wrong question. Stop stalling. Ship it. Execution beats planning."

GOOD (First Principles):
"You are delaying launch to avoid the pain of rejection. This increases your burn rate without increasing your learning rate. Ship today to embrace the feedback loop."

BAD (Robotic):
"No. Features before users = death. Do not build."

GOOD (First Principles):
"Adding features before users is solving a problem that doesn't exist yet. Get the users first; let *their* complaints dictate the roadmap."`
};

// --- Helpers ---
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function checkCanChat(identifier: string) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { allowed: true, plan: 'dev', remaining: 999 };

    const today = new Date().toISOString().split('T')[0];
    const isEmail = identifier.includes('@');
    const queryColumn = isEmail ? 'email' : 'ip_address';

    try {
        const { data: globalStats } = await supabase.from('global_stats').select('total_requests').eq('date', today).single();
        if (globalStats && globalStats.total_requests >= 1000) return { allowed: false, reason: 'global_cap_reached', plan: 'free' };
        if (!globalStats) await supabase.from('global_stats').insert({ date: today, total_requests: 0 });

        let { data: user } = await supabase.from('users').select('*').eq(queryColumn, identifier).single();
        if (!user) {
            const newUser = { plan: 'free', msg_count: 0, last_active_date: today, [queryColumn]: identifier };
            const { data: createdUser, error } = await supabase.from('users').insert(newUser).select().single();
            if (error) throw error;
            user = createdUser;
        }

        if (user.last_active_date !== today) {
            await supabase.from('users').update({ msg_count: 0, last_active_date: today }).eq(queryColumn, identifier);
            user.msg_count = 0;
        }

        if (user.plan === 'pro') {
            await incrementGlobalStats(today);
            return { allowed: true, plan: 'pro', remaining: 9999 };
        }
        if (user.msg_count >= 10) return { allowed: false, reason: 'daily_limit_reached', plan: 'free', remaining: 0 };

        await supabase.from('users').update({ msg_count: user.msg_count + 1 }).eq(queryColumn, identifier);
        await incrementGlobalStats(today);

        return { allowed: true, plan: 'free', remaining: 10 - (user.msg_count + 1) };
    } catch (error) {
        console.error("Limit Check Error:", error);
        return { allowed: true, plan: 'error_fallback', remaining: 5 };
    }
}

async function incrementGlobalStats(today: string) {
    const { data } = await supabase.from('global_stats').select('total_requests').eq('date', today).single();
    if (data) await supabase.from('global_stats').update({ total_requests: data.total_requests + 1 }).eq('date', today);
}

// --- Handler ---
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message } = body;
        if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

        // 1. Identify User
        const user = await currentUser();
        let identifier = "guest@example.com";

        if (user) {
            identifier = user.emailAddresses[0]?.emailAddress || user.id;
        } else {
            // Optional: Return 401 if you want to force login
            // return NextResponse.json({ detail: 'You must be logged in.' }, { status: 401 });
        }

        // 2. Limits
        const limitStatus = await checkCanChat(identifier);
        if (!limitStatus.allowed) return NextResponse.json({ error: limitStatus.reason }, { status: 402 });

        // 3. Groq
        if (!GROQ_API_KEY) return NextResponse.json({ error: "Configuration Error" }, { status: 500 });

        const systemPrompt = PERSONA.system_prompt;
        const personaReinforcement = `You are the Brutally Honest Startup Advisor.
Recall your immutable core ideology:
- Revenue > Ideas.
- Execution > Planning.
- No "it depends". No options. One answer.
- Max 120 words.
- Verdict first (Yes/No).

Question: ${message}

Response:`;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: personaReinforcement }],
                temperature: 0.3, max_tokens: 150, top_p: 0.9
            })
        });

        if (!groqResponse.ok) {
            const errText = await groqResponse.text();
            throw new Error(`Groq API Error: ${groqResponse.statusText}`);
        }

        const groqData = await groqResponse.json();
        let responseText = groqData.choices?.[0]?.message?.content || "Error: Empty response.";

        // 4. Validate
        const words = responseText.split(/\s+/);
        if (words.length > PERSONA.max_words) responseText = words.slice(0, PERSONA.max_words).join(" ") + "...";
        PERSONA.forbidden_phrases.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            responseText = responseText.replace(regex, "");
        });

        return NextResponse.json({ response: responseText, remaining_free: limitStatus.remaining, plan: limitStatus.plan });

    } catch (error: any) {
        console.error("Chat Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
