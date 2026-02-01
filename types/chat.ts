export type MessageRole = 'user' | 'assistant';

export interface Message {
    role: MessageRole;
    content: string;
}

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    response: string;
    remaining_free?: number;
    plan?: string;
}
