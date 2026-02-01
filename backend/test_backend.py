import requests
import json
import sys

# Configuration
API_URL = "http://localhost:8000/chat"
PERSONA_FILE = "persona.json"

def load_config():
    try:
        with open(PERSONA_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: Could not find {PERSONA_FILE}. Make sure you run this from the backend directory.")
        sys.exit(1)

def test_backend():
    print("Loading persona rules...")
    config = load_config()
    forbidden_phrases = config.get("forbidden_phrases", [])
    max_words = config.get("max_words", 120)

    test_cases = [
        "Should I add AI features to my MVP?",
        "What do you think about my idea?",
        "I'm scared to launch because it's not perfect."
    ]

    print(f"\n--- Starting Backend Tests ({len(test_cases)} cases) ---")
    print(f"Target: {API_URL}")
    print(f"Constraints: Max {max_words} words")
    print(f"Forbidden: {forbidden_phrases}\n")

    passed = 0
    failed = 0

    for i, msg in enumerate(test_cases, 1):
        print(f"TEST {i}: Input = '{msg}'")
        try:
            resp = requests.post(API_URL, json={"message": msg})
            
            if resp.status_code != 200:
                print(f"  [FAIL] Status code {resp.status_code}")
                failed += 1
                print("-" * 40)
                continue
            
            data = resp.json()
            response_text = data.get("response", "")
            
            # Validation
            word_count = len(response_text.split())
            
            # Check for forbidden phrases (case-insensitive)
            found_forbidden = []
            for phrase in forbidden_phrases:
                if phrase.lower() in response_text.lower():
                    found_forbidden.append(phrase)
            
            print(f"  Response: \"{response_text}\"")
            print(f"  Stats: {word_count} words")
            
            errors = []
            if word_count > max_words:
                errors.append(f"Exceeded {max_words} words (Got {word_count})")
            if found_forbidden:
                errors.append(f"Found forbidden: {found_forbidden}")
                
            if not errors:
                print("  [PASS] All rules enforced")
                passed += 1
            else:
                print(f"  [FAIL] {'; '.join(errors)}")
                failed += 1
                
        except requests.exceptions.ConnectionError:
            print(f"  [FAIL] Connection Error. Is the backend running on {API_URL}?")
            failed += 1
        except Exception as e:
            print(f"  [FAIL] Exception: {e}")
            failed += 1
        print("-" * 40)

    print(f"\nFINAL RESULTS: {passed} PASS, {failed} FAIL")

if __name__ == "__main__":
    test_backend()
