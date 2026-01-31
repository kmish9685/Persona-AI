import { ChatResponse } from '../types/chat';

const API_URL = 'http://localhost:8000';

export async function sendMessage(message: string): Promise<ChatResponse> {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
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
