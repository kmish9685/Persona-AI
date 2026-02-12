export type MessageRole = 'user' | 'assistant';

export interface Message {
    role: MessageRole;
    content: string;
}

export interface ChatRequest {
    messages: Message[];
    mode?: 'single' | 'multi'; // New: support multi-persona mode
    persona?: string; // For single mode
}

export interface PersonaResponse {
    personaId: string;
    personaName: string;
    response: string;
}

export interface ChatResponse {
    response?: string; // For single mode
    responses?: PersonaResponse[]; // For multi mode
    mode: 'single' | 'multi';
    remaining_free?: number;
    plan?: string;
}
