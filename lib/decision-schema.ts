import { z } from 'zod';

const DECISION_TYPES = [
    'pivot', 'hire', 'raise', 'feature', 'pricing', 'custom'
] as const;

const RISK_LEVELS = [
    'low', 'medium', 'high'
] as const;

export const DecisionSchema = z.object({
    decisionType: z.enum(DECISION_TYPES),

    constraints: z.object({
        runwayMonths: z.coerce.number().min(0, "Runway must be 0 or more"),
        monthlyBurn: z.coerce.number().min(0, "Burn must be 0 or more"),
        currentMrr: z.coerce.number().min(0, "MRR must be 0 or more"),
        teamSize: z.coerce.number().min(1, "Team size must be at least 1"),
        skillset: z.string().min(3, "Please describe your skillset"),
        riskTolerance: z.enum(RISK_LEVELS),
    }),

    options: z.array(
        z.object({
            title: z.string().min(2, "Option cannot be empty")
        })
    ).min(2, "Please list at least 2 options").max(4, "Max 4 options"),

    blindspots: z.string().optional(),
    context: z.string().optional(),
});

export type DecisionFormValues = z.infer<typeof DecisionSchema>;
