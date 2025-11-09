import { Request, Response } from 'express';
import pool from '@/config/database';

// 프로필 조회
export const getProfile = async (req: Request, res: Response) => {
  try {
    const memberId = (req as any).user.memberId;

    // 회원 기본 정보 조회
    const [members] = await pool.query(
      'SELECT member_id, username, name, point FROM members WHERE member_id = ?',
      [memberId]
    );

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 카페인 정보 조회
    const [caffeineInfo] = await pool.query(
      'SELECT * FROM members_caffeine WHERE member_id = ?',
      [memberId]
    );

    const member = members[0];
    const caffeine = Array.isArray(caffeineInfo) && caffeineInfo.length > 0 
      ? caffeineInfo[0] 
      : null;

    res.json({
      ...member,
      caffeineInfo: caffeine
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: '프로필 조회 중 오류가 발생했습니다.' });
  }
};

// 프로필 업데이트
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const memberId = (req as any).user.memberId;
    const { name, weight_kg, max_caffeine } = req.body;

    // 회원 기본 정보 업데이트
    if (name) {
      await pool.query(
        'UPDATE members SET name = ? WHERE member_id = ?',
        [name, memberId]
      );
    }

    // 카페인 정보 업데이트
    if (weight_kg !== undefined || max_caffeine !== undefined) {
      const updates: string[] = [];
      const params: any[] = [];

      if (weight_kg !== undefined) {
        updates.push('weight_kg = ?');
        params.push(weight_kg);
      }

      if (max_caffeine !== undefined) {
        updates.push('max_caffeine = ?');
        params.push(max_caffeine);
      }

      params.push(memberId);

      await pool.query(
        `UPDATE members_caffeine SET ${updates.join(', ')}, updated_at = NOW() WHERE member_id = ?`,
        params
      );
    }

    // 업데이트된 프로필 조회
    const [members] = await pool.query(
      'SELECT member_id, username, name, point FROM members WHERE member_id = ?',
      [memberId]
    );

    const [caffeineInfo] = await pool.query(
      'SELECT * FROM members_caffeine WHERE member_id = ?',
      [memberId]
    );

    res.json({
      message: '프로필이 업데이트되었습니다.',
      profile: {
        ...members[0],
        caffeineInfo: Array.isArray(caffeineInfo) ? caffeineInfo[0] : null
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
};
