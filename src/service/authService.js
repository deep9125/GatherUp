// src/services/authService.js

import { mockUsers } from './mockUsers'; // <-- 1. Import the full list

// 2. Select ONE user to be "logged in" for this session.
//    You can change the index (e.g., mockUsers[1]) to test as a different user.
export const mockUser = mockUsers[0];