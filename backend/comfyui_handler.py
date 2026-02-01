import json
import requests
import uuid

# Configuration for ComfyUI API
COMFYUI_SERVER_ADDRESS = "127.0.0.1:8188"
CLIENT_ID = str(uuid.uuid4())

def queue_prompt(prompt_workflow):
    """Sends the workflow to ComfyUI for execution."""
    p = {"prompt": prompt_workflow, "client_id": CLIENT_ID}
    try:
        response = requests.post(f"http://{COMFYUI_SERVER_ADDRESS}/prompt", json=p)
        return response.json()
    except Exception as e:
        print(f"Failed to queue prompt: {e}")
        return None

def get_history(prompt_id):
    """Retrieves the history/result of a specific prompt execution."""
    try:
        response = requests.get(f"http://{COMFYUI_SERVER_ADDRESS}/history/{prompt_id}")
        return response.json()
    except Exception as e:
        print(f"Failed to get history: {e}")
        return None

def chat_with_comfyui(user_message: str):
    """
    Main interface function. 
    1. Loads the workflow template.
    2. Injects the user message into the input node.
    3. Queues the workflow.
    4. Pols for result (simplistic implementation).
    """
    # Load the workflow template
    # Switching to user-provided workflow
    workflow_path = "d:/Persona AI/comfyui/Persona AI.json"
    
    try:
        with open(workflow_path, "r") as f:
            workflow_data = json.load(f)
    except FileNotFoundError:
        return "Error: Workflow file not found."
    
    # Modify the workflow format for API usage
    # ComfyUI API expects "prompt": { "node_id": { inputs... class_type... }, ... }
    # which is different from the Save-Format (nodes array).
    # We need to construct the API prompt object from our save format or define it directly.
    # For robust API usage, it's often easier to define the API-format structure directly.
    # Since we built the save format in the previous step, let's construct the API format manually here 
    # to match the structure we defined in custom nodes.
    
    # API Structure construction based on our custom nodes
    prompt_api = {
        "1": {
            "inputs": {
                "persona_path": "d:/Persona AI/backend/persona.json"
            },
            "class_type": "PersonaLoader"
        },
        "2": {
            "inputs": {
                "text": user_message # Primitive node usually has 'text' or specific value
            },
            # Note: PrimitiveNodes in API are tricky, usually we just link to the target node directly 
            # or use a specific string node. Let's assume we replace the input of Node 3 directly for simplicity.
        },
        "3": {
            "inputs": {
                "persona_rules": ["1", 0],
                "user_message": user_message # Injecting directly here instead of using Node 2
            },
            "class_type": "PersonaPromptBuilder"
        },
        "4": {
            "inputs": {
                "system_prompt": ["3", 0],
                "user_message": ["3", 1],
                "model_name": "mistral"
            },
            "class_type": "OllamaNode"
        },
        "5": {
            "inputs": {
                "raw_response": ["4", 0],
                "persona_rules": ["1", 0]
            },
            "class_type": "ResponseValidator"
        }
        # Note: ComfyUI doesn't return output in HTTP response body directly. 
        # We need to look for headers or history. 
        # Usually we might add a SaveText node or similar to capture output easily, 
        # or we just rely on "ResponseValidator" execution if we can capture its output.
        # But standard ComfyUI API usage involves WebSocket for progress or Polling history.
    }
    
    # Removing Node 2 from API prompt as we injected directly into Node 3
    
    # Queue workflow
    response = queue_prompt(prompt_api)
    if not response:
        return "Error: Could not connect to ComfyUI."
    
    prompt_id = response.get('prompt_id')
    if not prompt_id:
        return "Error: No prompt ID returned."
        
    # Polling for result (Waiting for execution)
    import time
    for _ in range(20): # Wait up to 20 seconds
        time.sleep(1)
        history = get_history(prompt_id)
        if history and prompt_id in history:
            # Execution done
            outputs = history[prompt_id].get('outputs', {})
            # Node 5 is our final node
            if '5' in outputs:
                 # Check what our node returns. Custom nodes return tuples.
                 # By default, ComfyUI history stores the OUTPUTS of the nodes.
                 # We need to make sure our ResponseValidator writes something we can read?
                 # Actually, ComfyUI history stores the cached output of nodes.
                 val = outputs['5'].get('final_response', [])
                 if val:
                     return val[0] # Assuming list of outputs
            break
            
    return "Error: Timeout waiting for ComfyUI or no output captured."

