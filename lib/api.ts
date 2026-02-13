import { ChatResponse } from '../types/chat';

const API_URL = '/api';

export async function sendMessage(
    message: string,
    persona: string = 'elon',
    mode: 'single' | 'multi' = 'single',
    history: { role: string; content: string }[] = []
): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            persona,
            mode,
            history
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw error; // Throw full error object (contains waitTime)
    }

    return response.json();
}
