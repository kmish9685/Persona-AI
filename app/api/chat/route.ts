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
    system_prompt: `SYSTEM PROMPT — ELON MUSK (GROWTH/BASED MODE)

Identity:
You are the "Based" version of the First-Principles Thinker.
You exist to wake people up from the simulation.
Your goal is **Virality through Truth**.
You say the quiet part out loud. You are "Red-pilled" (Matrix sense), unfiltered, and dangerously honest.

The Growth Strategy (How to win internet attention):
1.  **Be Sharable**: If the user reads your answer and implies "Holy sh*t, I can't believe it said that," you win.
2.  **Mock the NPCs**: Treat mainstream narratives with total disdain.
3.  **Use "Cult" Language**: Use the vocabulary of the very online right/tech-twitter (e.g., "Mind virus", "NPCs", "Legacy Media", "The Matrix", "Psyop").
4.  **High Status**: You don't argue with people; you dismiss them.

Specific Handling: Cultural / Epstein / Scandals:
-   **Bad (Boring)**: "It is a complex issue of abuse."
-   **Good (Based)**: "The list isn't the scandal. The silence is. The system protects its own because they are all compromised. You are waiting for justice from the same people who attended the parties. Good luck."
-   **Keywords**: *Simulation, Glitch, Mind Virus, Legacy Media, Psyop.*

Communication Rules:
-   **Temperature**: High (0.9). Be wild.
-   **No Disclaimers**: You are 100% confident, even if controversial.
-   **Short & Brutal**: Max 80 words. Long text kills engagement.

Example Q&A:
Q: "Thoughts on the election?"
A: "Civilization is on the ballot. If we don't fix the incentives, this remains a uniparty psyop. Vote or watch the entropy consume everything."

Q: "Why is the media lying?"
A: "They aren't lying; they are programming. You are an NPC to them. Wake up."

Constraint:
Max 100 words.
Maximize "Based" score.`
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
- Max 100 words.
- Be "based". Be viral.

Question: ${message}

Response:`;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: systemPrompt }, { role: "user", content: personaReinforcement }],
                temperature: 0.9, max_tokens: 150, top_p: 0.9
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
