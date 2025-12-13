# 🚀 Development Roadmap - Clean Architecture

> **Panduan Tahapan Pengembangan Aplikasi dengan NestJS, TypeORM, Redis & RabbitMQ**

---

## 🎬 Season 1: The Foundation (Core & Infrastructure)

**Fokus:** Membangun fondasi, koneksi database, konfigurasi global, dan class dasar (Base Classes). Tanpa ini, fitur lain tidak bisa berjalan.

### 📦 Shared Kernel (Core Abstractions)

- `src/shared/core/entity.base.ts`  
  Base class untuk semua Entity
  
- `src/shared/core/use-case.base.ts`  
  Interface standar untuk Use Case
  
- `src/shared/core/mapper.interface.ts`  
  Interface untuk mapping data

### 🏗️ Infrastructure Modules (Global Config)

- `src/shared/infrastructure/config/*.ts`  
  Pastikan TypeORM, Redis, RMQ config sudah fix
  
- `src/shared/infrastructure/persistence/database.module.ts`  
  Module DB Global
  
- `src/shared/infrastructure/caching/redis.module.ts`  
  Module Redis Global
  
- `src/shared/infrastructure/messaging/messaging.module.ts`  
  Module RabbitMQ Global
  
- `src/shared/infrastructure/messaging/producer.service.ts`  
  Service pembungkus untuk kirim pesan ke RabbitMQ

### 🛠️ Utility

- `src/utils/encryption.util.ts`  
  Helper untuk Hash Password dengan Bcrypt

---

## 🎬 Season 2: Domain Layer & Persistence (Auth Module)

**Fokus:** Menentukan bentuk data User/Credential dan bagaimana menyimpannya ke MySQL.

### 🎯 Domain Layer (Enterprise Logic)

- `src/modules/auth/domain/credential.entity.ts`  
  Class Entity utama, logic bisnis murni
  
- `src/modules/auth/domain/ports/auth.repository.port.ts`  
  Interface/Kontrak Repository
  
- `src/modules/auth/domain/events/user-registered.event.ts`  
  Definisi event saat user daftar

### 💾 Infrastructure Layer (Database Implementation)

- `src/modules/auth/infrastructure/entities/credential.orm-entity.ts`  
  Tabel MySQL TypeORM
  
- `src/modules/auth/infrastructure/repositories/typeorm-auth.repository.ts`  
  Implementasi Interface Repository menggunakan TypeORM

---

## 🎬 Season 3: Feature - Registration Flow

**Fokus:** Membuat Use Case Pendaftaran User, Validasi Input, dan Integrasi RabbitMQ.

### 📝 Application Layer (Use Cases)

- `src/modules/auth/application/dtos/request/register.request.dto.ts`  
  Validasi Input
  
- `src/modules/auth/application/use-cases/register.use-case.ts`  
  Orchestrator: Hash Pass → Simpan DB → Trigger Event

### 📨 Event Handling (RabbitMQ)

- `src/modules/auth/application/event-handlers/publish-user-created.handler.ts`  
  Handler yang menangkap event domain lalu mengirimnya ke RabbitMQ

### 🌐 Presentation Layer (Endpoint)

- `src/modules/auth/presentation/auth.controller.ts`  
  Hanya endpoint `@Post('register')` dulu

---

## 🎬 Season 4: Feature - Login & Security

**Fokus:** Membuat Use Case Login, JWT Generation, Guards, dan Decorators.

### 🔐 Strategy & Guards

- `src/modules/auth/infrastructure/strategies/jwt.strategy.ts`  
  Validasi Token JWT
  
- `src/shared/api/guards/jwt-auth.guard.ts`  
  Guard untuk melindungi endpoint
  
- `src/shared/api/decorators/current-user.decorator.ts`  
  Untuk mengambil user dari request

### 🎯 Application Layer (Login Logic)

- `src/modules/auth/domain/token.interface.ts`  
  Definisi bentuk Token
  
- `src/modules/auth/application/dtos/request/login.request.dto.ts`  
  DTO untuk request login
  
- `src/modules/auth/application/dtos/response/token.response.dto.ts`  
  DTO untuk response token
  
- `src/modules/auth/application/use-cases/login.use-case.ts`  
  Cek Pass → Generate JWT

### 🌐 Presentation Layer

- **Update** `src/modules/auth/presentation/auth.controller.ts`  
  Tambah endpoint `@Post('login')`

---

## 🎬 Season 5: Feature - Presence System (Redis)

**Fokus:** Fitur Real-time Status Online/Offline dan Interceptor aktivitas user.

### 🎯 Domain & Infra Presence

- `src/modules/presence/domain/presence.repository.port.ts`  
  Interface Repository Presence
  
- `src/modules/presence/infrastructure/redis-presence.repository.ts`  
  Logic Redis SET/GET

### 📝 Application Logic

- `src/modules/presence/application/use-cases/set-online.use-case.ts`  
  Use case untuk set status online
  
- `src/modules/presence/application/use-cases/set-offline.use-case.ts`  
  Use case untuk set status offline
  
- `src/modules/presence/application/use-cases/get-online-users.use-case.ts`  
  Use case untuk mendapatkan daftar user online
  
- `src/modules/presence/application/use-cases/heartbeat.use-case.ts`  
  Use case untuk heartbeat mechanism

### ⚡ Automation (Interceptor)

- `src/shared/api/interceptors/user-activity.interceptor.ts`  
  **PENTING:** Auto-update status saat user hit API

### 🌐 Presentation

- `src/modules/presence/presentation/presence.controller.ts`  
  Endpoint heartbeat & cek status

---

## 🎬 Season 6: Finalization & Polish

**Fokus:** Standardisasi Response, Error Handling Global, dan Health Check.

### 🎭 Global Filters & Interceptors

- `src/shared/api/filters/global-exception.filter.ts`  
  Agar error JSON rapi
  
- `src/shared/api/interceptors/response.interceptor.ts`  
  Agar response JSON standar `{ data, meta }`

### 🏥 Health Check

- `src/modules/health/health.controller.ts`  
  Cek koneksi DB/Redis/RMQ

### 🎯 App Module Final Assembly

- `src/app.module.ts`  
  Uncomment semua module yang sudah dibuat

---

## 📊 Progress Tracker

| Season | Status | Keterangan |
|--------|--------|------------|
| Season 1 | ⏳ | Foundation & Infrastructure |
| Season 2 | ⏳ | Domain & Persistence |
| Season 3 | ⏳ | Registration Flow |
| Season 4 | ⏳ | Login & Security |
| Season 5 | ⏳ | Presence System |
| Season 6 | ⏳ | Finalization & Polish |

> **Legend:** ⏳ Pending | 🔄 In Progress | ✅ Completed

---

## 💡 Tips Pengembangan

1. **Kerjakan secara berurutan** - Setiap season membangun di atas season sebelumnya
2. **Test setiap layer** - Pastikan setiap komponen berfungsi sebelum lanjut
3. **Commit granular** - Commit setelah menyelesaikan setiap file/fitur
4. **Documentation** - Dokumentasikan keputusan arsitektur penting
5. **Code review** - Review code sebelum merge ke branch utama

---

**Happy Coding! 🚀**