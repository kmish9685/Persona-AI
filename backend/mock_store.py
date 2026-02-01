from datetime import date

# In-memory store shared across modules
# Key: email or ip, Value: dict (user record)
MOCK_USERS = {}

def get_mock_user(identifier):
    return MOCK_USERS.get(identifier)

def upsert_mock_user(identifier, data):
    if identifier not in MOCK_USERS:
        MOCK_USERS[identifier] = data
    else:
        MOCK_USERS[identifier].update(data)
    return MOCK_USERS[identifier]
