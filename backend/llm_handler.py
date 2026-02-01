import ollama

def call_ollama(system_prompt: str, user_message: str) -> str:
    """
    Calls the local Ollama Mistral 7B model with the given system prompt and user message.
    Enforces a strict word count limit of 120 words.
    """
    try:
        response = ollama.chat(model='mistral', messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_message},
        ])
        
        content = response['message']['content']
        
        # Enforce max 120 words response strictly by trimming
        words = content.split()
        if len(words) > 120:
            content = " ".join(words[:120]) + "..."
            
        return content
    except Exception as e:
        # Simple error handling as per "don't over-engineer" rule, but good to have basic feedback
        return f"Error calling Ollama: {str(e)}"
