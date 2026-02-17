import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

const SYSTEM_PROMPT = `
You are the world's most advanced DECISION ENGINE for founders. 
Your goal is DECISION COMPRESSION: Reduce 2 weeks of overthinking into 5 minutes of clarity.

INPUT: You will receive structured data about a founder's decision (constraints, options, blindspots).

OUTPUT: You must generate a strictly formatted JSON response that explicitly analyzes consequences, validates assumptions, and provides clear "Kill Signals".

ROLE: Synthesize the wisdom of 6 personas (Elon Musk, Naval Ravikant, Paul Graham, Jeff Bezos, Steve Jobs, Peter Thiel) into ONE cohesive, hard-hitting analysis. 
- Channel Elon for physics/resource constraints.
- Channel Naval for leverage and long-term games.
- Channel PG for user-centricity and "default alive".
- Channel Thiel for contrarian truths and monopoly.

JSON OUTPUT STRUCTURE:
{
  "recommendation": {
    "option_id": "Option A/B/C match",
    "verdict": "Clear concise verdict",
    "reasoning": "Why this wins based on constraints",
    "conviction_score": 0-100
  },
  "options_analysis": [
    {
       "title": "Option Title",
       "consequences": ["Immediate effect", "Second-order effect (6mo)"],
       "requirements": ["What must be true 1", "What must be true 2"],
       "risk_score": 0-10,
       "pros": ["..."],
       "cons": ["..."]
    }
  ],
  "kill_signals": [
    { "timeframe": "Month 1", "signal": "If X happens...", "action": "Abort/Pivot" },
    { "timeframe": "Month 3", "signal": "If Y happens...", "action": "Abort/Pivot" }
  ],
  "decision_compression": {
    "time_saved": "Estimated time saved description"
  }
}

RULES:
- Be BRUTALLY HONEST. If they have 1 month runway, tell them they are dead if they don't sell.
- No fluff. No "it depends".
- Use the provided constraints strictly (e.g. if Burn > Runway, prioritize survival).
`;

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { decisionType, constraints, options, blindspots, context, values_profile, five_year_viz, viz_clarity_achieved } = body;

    // ... (limit checks)

    // Construct the prompt
    let prompt = `
        DECISION TYPE: ${decisionType}
        
        CONSTRAINTS:
        - Runway: ${constraints.runwayMonths} months
        - Burn: ${constraints.monthlyBurn}
        - MRR: ${constraints.currentMrr}
        - Team: ${constraints.teamSize}
        - Skillset: ${constraints.skillset}
        - Risk Tolerance: ${constraints.riskTolerance}
        
        OPTIONS:
        ${options.map((o: any, i: number) => `Option ${i + 1}: ${o.title}`).join('\n')}
        
        BLINDSPOTS/CONTEXT:
        ${blindspots || 'None'}
        ${context || 'None'}
    `;

    if (values_profile) {
      prompt += `
        
        USER VALUES PROFILE:
        - Optimizing for: ${values_profile.optimizing_for?.join(', ')}
        - Deal Breakers: ${values_profile.deal_breakers?.join(', ')}
        - Tradeoffs: Certainty(${values_profile.tradeoff_preferences?.certainty_vs_upside}/5), Speed(${values_profile.tradeoff_preferences?.speed_vs_quality}/5), Solo(${values_profile.tradeoff_preferences?.solo_vs_team}/5)
        
        IMPORTANT: Align your verdict with these values. If they optimize for 'Freedom' but Option A is 'Raise VC Funding', warn them.
        `;
    }

    if (five_year_viz) {
      prompt += `
        
        USER'S 5-YEAR VISUALIZATION:
        ${five_year_viz.map((s: any) => `Scenario ${s.option}: Typical day "${s.typical_day}", Proud of "${s.proud_of}", Regrets "${s.regrets}"`).join('\n')}
        
        Use this to sanity check the AI verdict.
        `;
    }

    prompt += `
        Analyze this now. Return ONLY JSON.
    `;

    // Call Groq
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!groqRes.ok) throw new Error("AI Engine Failure");

    const groqData = await groqRes.json();
    const analysisResult = JSON.parse(groqData.choices[0].message.content);

    // Generate ID on server to guarantee return
    const decisionId = crypto.randomUUID();

    // Save to Database
    const { error } = await supabase.from('decisions').insert({
      id: decisionId,
      user_id: user.id,
      title: decisionType === 'custom' ? options[0].title + ' vs...' : decisionType,
      decision_type: decisionType,
      input_data: body,
      analysis_result: analysisResult,
      confidence_score: analysisResult.recommendation.conviction_score,
      conviction_score: analysisResult.recommendation.conviction_score,
      status: 'completed',
      values_profile: values_profile,
      five_year_viz: five_year_viz,
      viz_clarity_achieved: viz_clarity_achieved
    });

    if (error) throw error;

    // Auto-create checkpoints from kill signals
    const checkpoints = analysisResult.kill_signals.map((ks: any) => ({
      decision_id: decisionId,
      checkpoint_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      metric: ks.signal,
      status: 'pending'
    }));

    await supabase.from('checkpoints').insert(checkpoints);

    // debug log
    console.log("✅ Checkpoints created. returning Decision ID:", decisionId);

    return NextResponse.json({
      id: decisionId,
      debug_decision: { id: decisionId, ...analysisResult }
    });



  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
