import { ChatResponse } from '../types/chat';

const API_URL = '/api';

export async function sendMessage(
    message: string,
    persona: string = 'elon',
    mode: 'single' | 'multi' = 'single'
): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            persona,
            mode
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
}
