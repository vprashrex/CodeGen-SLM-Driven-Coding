FROM python:3.11


WORKDIR /app
COPY . /app/ 
COPY ./api/ /app/api
RUN ls -la ./api/*

RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]

#RUN apt-get update && \
#    apt-get install -y git



#RUN apt-get update && \
#    apt-get install -y \
#    build-essential \
#    python3-dev \
#    python3-setuptools \
#    gcc \
#    make \
#    wget


#RUN python3 -m pip install --no-cache-dir -r requirements.txt


# purge unused
#RUN apt-get remove -y --purge make gcc build-essential \
#    && apt-get autoremove -y \
#    && rm -rf /var/lib/apt/lists/*

# Set environment variables
#ENV PYTHONUNBUFFERED=1

