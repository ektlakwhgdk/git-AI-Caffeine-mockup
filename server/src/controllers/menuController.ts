import { Request, Response } from 'express';
import pool from '@/config/database';

// 모든 브랜드 조회
export const getBrands = async (req: Request, res: Response) => {
  try {
    const [brands] = await pool.query('SELECT * FROM brand ORDER BY brand_name');
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ error: '브랜드 조회 중 오류가 발생했습니다.' });
  }
};

// 특정 브랜드의 메뉴 조회
export const getMenusByBrand = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    
    const [menus] = await pool.query(
      `SELECT m.*, b.brand_name 
       FROM menu m 
       JOIN brand b ON m.brand_id = b.brand_id 
       WHERE m.brand_id = ? 
       ORDER BY m.category, m.menu_name, m.size`,
      [brandId]
    );
    
    res.json(menus);
  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ error: '메뉴 조회 중 오류가 발생했습니다.' });
  }
};

// 모든 메뉴 조회 (브랜드 정보 포함)
export const getAllMenus = async (req: Request, res: Response) => {
  try {
    const [menus] = await pool.query(
      `SELECT m.*, b.brand_name 
       FROM menu m 
       JOIN brand b ON m.brand_id = b.brand_id 
       ORDER BY b.brand_name, m.category, m.menu_name, m.size`
    );
    
    res.json(menus);
  } catch (error) {
    console.error('Get all menus error:', error);
    res.status(500).json({ error: '메뉴 조회 중 오류가 발생했습니다.' });
  }
};

// 메뉴 검색
export const searchMenus = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: '검색어를 입력해주세요.' });
    }
    
    const [menus] = await pool.query(
      `SELECT m.*, b.brand_name 
       FROM menu m 
       JOIN brand b ON m.brand_id = b.brand_id 
       WHERE m.menu_name LIKE ? OR b.brand_name LIKE ?
       ORDER BY b.brand_name, m.menu_name`,
      [`%${query}%`, `%${query}%`]
    );
    
    res.json(menus);
  } catch (error) {
    console.error('Search menus error:', error);
    res.status(500).json({ error: '메뉴 검색 중 오류가 발생했습니다.' });
  }
};
