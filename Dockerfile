FROM python:3.11

RUN apt-get update && \
    apt-get install -y git

WORKDIR /app

COPY . .

RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3-dev \
    python3-setuptools \
    gcc \
    make \
    wget

COPY requirements.txt .
WORKDIR /app

RUN git clone https://github.com/abacaj/ctransformers -b replit-code

RUN python3 -m pip install --no-cache-dir -r requirements.txt

# Check if the directory exists
RUN if [ ! -d models ]; then \
        mkdir -p /app/models && \
        wget -O /app/models/replit-v2-codeinstruct-3b.q4_1.bin https://huggingface.co/abacaj/Replit-v2-CodeInstruct-3B-ggml/resolve/main/replit-v2-codeinstruct-3b.q4_1.bin; \
    fi

# Set environment variables
ENV PYTHONUNBUFFERED=1

CMD ["python3","-u","inference.py"]