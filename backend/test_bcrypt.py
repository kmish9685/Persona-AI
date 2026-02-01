from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    password = "password123"
    print(f"Hashing '{password}'...")
    hashed = pwd_context.hash(password)
    print(f"Hash: {hashed}")
    
    print("Verifying...")
    valid = pwd_context.verify(password, hashed)
    print(f"Valid: {valid}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
