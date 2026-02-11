import { ChatResponse } from '../types/chat';


const API_URL = '/api';

export async function sendMessage(
    messages: { role: 'user' | 'assistant', content: string }[],
    persona: string = 'elon'
): Promise<ChatResponse> {
    try {
        // Extract just the last user message for the API
        const lastMessage = messages[messages.length - 1];

        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: lastMessage.content,
                persona: persona
            }),
        });

        if (!response.ok) {
            if (response.status === 402) {
                throw new Error("402 Payment Required");
            }
            throw new Error(`API error: ${response.statusText}`);
        }

        const data: ChatResponse = await response.json();
        return data;
    } catch (error: any) {
        console.error("Failed to send message:", error);
        if (error.message.includes("402")) throw error;
        return { response: "Error: Could not connect to Persona AI." };
    }
}
