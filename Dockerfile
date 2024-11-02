FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . /app

ENV GROQ_API_KEY=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
CMD ["node", "."]