import express from 'express';
import { signup, login } from '@/controllers/authController';
import { getBrands, getMenusByBrand, getAllMenus, searchMenus } from '@/controllers/menuController';
import { 
  addCaffeineIntake, 
  getTodayHistory, 
  getHistory, 
  getCurrentCaffeineInfo,
  updateCaffeineInfo 
} from '@/controllers/caffeineController';
import { getProfile, updateProfile } from '@/controllers/profileController';
import { authenticateToken } from '@/middleware/auth';

const router = express.Router();

// 인증 라우트 (토큰 불필요)
router.post('/auth/signup', signup);
router.post('/auth/login', login);

// 메뉴 라우트 (공개)
router.get('/brands', getBrands);
router.get('/brands/:brandId/menus', getMenusByBrand);
router.get('/menus', getAllMenus);
router.get('/menus/search', searchMenus);

// 카페인 라우트 (인증 필요)
router.post('/caffeine/intake', authenticateToken, addCaffeineIntake);
router.get('/caffeine/today', authenticateToken, getTodayHistory);
router.get('/caffeine/history', authenticateToken, getHistory);
router.get('/caffeine/info', authenticateToken, getCurrentCaffeineInfo);
router.put('/caffeine/info', authenticateToken, updateCaffeineInfo);

// 프로필 라우트 (인증 필요)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
