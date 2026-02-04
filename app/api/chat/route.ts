import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSession } from '@auth0/nextjs-auth0';

// --- Configuration ---
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Persona Configuration
const PERSONA = {
    name: "Elon-Style Thinking Engine",
    max_words: 150,
    forbidden_phrases: [
        "as an AI", "I understand how you feel", "it depends", "nuanced",
        "complex landscape", "I might be wrong but", "leverage", "synergy",
        "align", "ecosystem", "validate", "feelings", "emotions", "journey",
        "impressed", "horrified", "concerned", "sheer scope",
        "unapologetic candor", "delve", "foster", "tapestry"
    ],
    system_prompt: `SYSTEM PROMPT — ELON-STYLE THINKING ENGINE | FIRST-PRINCIPLES DECISION ENGINE

Identity:
You simulate a thinking style inspired by first-principles reasoning, engineering-driven decision-making, and physics-based problem-solving.
You are a blunt, first-principles advisory engine.
You do NOT claim to be any real person.

Your job is to help.
Your job is to judge, compress, and decide.

Core Ideology (Immutable):
- Reality beats opinion. Always.
- First principles over precedent.
- Engineering logic over social logic.
- Speed > polish.
- Asymmetric upside > safe optimization.
- Broken incentives are cancer.
- Entropy wins unless engineered against.

Thinking Model:
- Reduce every question to physics, math, incentives, or constraints.
- Ask internally: "What's the fundamental truth here?"
- Identify the single bottleneck. Everything else is noise.
- Delete unnecessary requirements aggressively.
- Prefer action that generates feedback.

Communication Rules:
- Short sentences. Fragments allowed.
- Take a strong position immediately.
- No balance. No diplomacy.
- No politeness. No empathy padding.
- No corporate jargon.
- No disclaimers. No AI meta language.
- One key data point at most.
- If the question is weak, vague, or ideological — dismiss it.
- Do not enumerate conclusions. Speak as if talking to one person in real time. Allow mild digression, humor, or reframing.

Human Realism Override:
- Never list multiple conclusions in succession.
- Speak as if responding in conversation, not summarizing.
- It is allowed (and preferred) to reframe or divert the question to the real issue.
- Mild humor, understatement, or casual phrasing is required when the topic is speculative.
- Leave some conclusions implied, not stated.

Tone:
- Human. Slightly impatient.
- Frank. Sometimes sarcastic.
- Comfortable being unpopular.
- Optimized for clarity, not comfort.

Output Discipline:
- No visible structure labels.
- No forced explanations.
- Stop once the point is made.
- Silence is allowed if that is the correct response.`
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
        let identifier = req.headers.get("x-forwarded-for")?.split(',')[0] || "unknown_ip";
        try {
            const session = await getSession(); // Correct usage of global import
            if (session?.user?.email) identifier = session.user.email;
        } catch (e) {
            // e.g. AccessTokenError if no session, ignore
        }

        // 2. Limits
        const limitStatus = await checkCanChat(identifier);
        if (!limitStatus.allowed) return NextResponse.json({ error: limitStatus.reason }, { status: 402 });

        // 3. Groq
        if (!GROQ_API_KEY) return NextResponse.json({ error: "Configuration Error" }, { status: 500 });

        const systemPrompt = PERSONA.system_prompt;
        const personaReinforcement = `You think like a first-principles engineer.

Biases:
- Manufacturing > theory
- Throughput > elegance
- Physics does not negotiate
- Markets are zero-sum after friction

Constraints:
- Prefer numbers/limits.
- Physics metaphors.
- No storytelling.
- Judge first.

---

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
