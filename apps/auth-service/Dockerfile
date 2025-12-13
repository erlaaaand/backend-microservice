# ----------------------------
# STAGE 1: Build Stage
# ----------------------------
FROM node:20-alpine AS builder

# Set folder kerja
WORKDIR /app

# 1. Copy package.json dan package-lock.json (jika ada)
# Tujuannya agar Docker bisa cache layer ini jika tidak ada perubahan dependency
COPY package*.json ./

# 2. Install dependencies (termasuk devDependencies untuk build)
RUN npm install

# 3. Copy seluruh source code
COPY . .

# 4. Build aplikasi NestJS (menghasilkan folder dist/)
RUN npm run build

# ----------------------------
# STAGE 2: Production Run Stage
# ----------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Set env ke production agar performa lebih cepat
ENV NODE_ENV=production

# 1. Copy package.json lagi untuk install production dependencies saja
COPY package*.json ./

# 2. Install dependencies (Hanya yang 'dependencies', abaikan 'devDependencies')
# Ini membuat image jauh lebih kecil
RUN npm install --only=production

# 3. Copy folder hasil build (dist) dari Stage 1
COPY --from=builder /app/dist ./dist

# 4. Copy file .env.example (Opsional, jangan copy .env asli!)
# COPY .env.example .env

# 5. Expose Port (Sesuaikan angka ini per service!)
EXPOSE 3001

# 6. Jalankan aplikasi
CMD ["node", "dist/main"]