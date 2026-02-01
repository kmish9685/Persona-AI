# Use Python 3.11
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/requirements.txt backend/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy all backend code
COPY backend/ backend/

# Expose port (Railway will override with $PORT)
EXPOSE 8000

# Start command
CMD cd backend && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
