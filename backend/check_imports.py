try:
    print("Importing database...")
    import database
    print("Importing auth...")
    import auth
    print("Importing main...")
    import main
    print("All imports successful.")
except Exception as e:
    print(f"Import Error: {e}")
    import traceback
    traceback.print_exc()
