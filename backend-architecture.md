# Meme Gallery API - Backend Architecture

**Tech Stack:** Express.js, TypeScript, Prisma ORM, PostgreSQL

---

## 1. Planned Routes

### Public Routes
- `GET /` - Health check
- `GET /memes` - Retrieve all memes with user info and likes
- `GET /memes/:id` - Get single meme by ID

### Protected Routes (Authentication Required)
- `POST /memes` - Create new meme (title, url, category)
- `PUT /memes/:id` - Update existing meme
- `DELETE /memes/:id` - Delete meme
- `POST /memes/:id/like` - Toggle like/unlike on a meme

---

## 2. Models and Relationships

### User Model
- `id` (Int, PK): Auto-increment
- `username` (String, Unique): User's login name
- `password` (String): Hashed password
- Relations: `memes[]`, `likes[]`

### Meme Model
- `id` (Int, PK): Auto-increment
- `title` (String): Meme caption
- `url` (String): Image URL
- `userId` (Int, FK): Creator's user ID
- `category` (Enum): CLASSIC | DANK | WHOLESOME
- Relations: `user`, `likes[]`

### UserLikesMeme Model (Junction Table)
- `id` (Int, PK): Auto-increment
- `userId` (Int, FK): User who liked
- `memeId` (Int, FK): Meme that was liked
- Unique constraint: `[userId, memeId]` (prevents duplicate likes)

### Relationships Diagram
```
User (1) ──────────── (Many) Meme
  │                              │
  └──── (Many) UserLikesMeme (Many) ────┘
```

**Summary:**
- A User creates many Memes
- A User likes many Memes (via UserLikesMeme)
- A Meme can be liked by many Users (via UserLikesMeme)

---

## 3. Authentication Flow

### Current Implementation (Development)
1. Client sends `Authorization: Bearer <userId>` header
2. `authenticateToken` middleware extracts token
3. Token is parsed as numeric user ID (simplified for testing)
4. Middleware attaches `{ userId: number }` to `req.user`
5. Protected routes access `req.user.userId`

**Response Codes:**
- `401 Unauthorized` - Missing or invalid token
- `200/201` - Valid token, request processed

### Production Plan
- Replace numeric token with **JWT (JSON Web Tokens)**
- Flow:
  1. User logs in → server generates signed JWT with user payload
  2. Client stores JWT and sends in `Authorization: Bearer <jwt>`
  3. Server verifies JWT signature and expiration
  4. Decoded payload provides user identity

---

## 4. User Roles

### Current Implementation
**Single Role: Standard User**
- All authenticated users have equal permissions
- Users can:
  - Create memes
  - Update/delete any meme (no ownership check)
  - Like/unlike any meme
  - View all memes



