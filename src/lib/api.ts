const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// 토큰 관리
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// API 요청 헬퍼
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // 추가 헤더 병합
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API 요청:', url, options);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('API 응답:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('API 에러:', error);
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('API 응답 데이터:', data);
  return data;
}

// 인증 API
export const authAPI = {
  signup: async (data: {
    username: string;
    password: string;
    name: string;
    birthDate: string;
    gender: '남자' | '여자';
    weight_kg?: number;
  }) => {
    return apiRequest<{
      message: string;
      token: string;
      user: { member_id: number; username: string; name: string };
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { username: string; password: string }) => {
    return apiRequest<{
      message: string;
      token: string;
      user: { member_id: number; username: string; name: string; point: number };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 메뉴 API
export const menuAPI = {
  getBrands: async () => {
    return apiRequest<Array<{ brand_id: number; brand_name: string }>>('/brands');
  },

  getMenusByBrand: async (brandId: number) => {
    return apiRequest<
      Array<{
        menu_id: number;
        brand_id: number;
        brand_name: string;
        menu_name: string;
        category: 'coffee' | 'decaf';
        size: 'small' | 'regular' | 'large';
        caffeine_mg: number;
      }>
    >(`/brands/${brandId}/menus`);
  },

  getAllMenus: async () => {
    return apiRequest<
      Array<{
        menu_id: number;
        brand_id: number;
        brand_name: string;
        menu_name: string;
        category: 'coffee' | 'decaf';
        size: 'small' | 'regular' | 'large';
        caffeine_mg: number;
      }>
    >('/menus');
  },

  searchMenus: async (query: string) => {
    return apiRequest<
      Array<{
        menu_id: number;
        brand_id: number;
        brand_name: string;
        menu_name: string;
        category: 'coffee' | 'decaf';
        size: 'small' | 'regular' | 'large';
        caffeine_mg: number;
      }>
    >(`/menus/search?query=${encodeURIComponent(query)}`);
  },
};

// 카페인 API
export const caffeineAPI = {
  addIntake: async (data: {
    menu_id?: number;
    brand_name: string;
    menu_name: string;
    caffeine_mg: number;
  }) => {
    return apiRequest<{
      message: string;
      caffeineInfo: {
        current_caffeine: number;
        max_caffeine: number;
      };
    }>('/caffeine/intake', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getTodayHistory: async () => {
    return apiRequest<
      Array<{
        history_id: number;
        member_id: number;
        menu_id: number | null;
        brand_name: string;
        menu_name: string;
        caffeine_mg: number;
        drinked_at: string;
      }>
    >('/caffeine/today');
  },

  getHistory: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    return apiRequest<
      Array<{
        history_id: number;
        member_id: number;
        menu_id: number | null;
        brand_name: string;
        menu_name: string;
        caffeine_mg: number;
        drinked_at: string;
      }>
    >(`/caffeine/history${query}`);
  },

  getCurrentInfo: async () => {
    return apiRequest<{
      member_id: number;
      age: string;
      weight_kg: number;
      gender: '남자' | '여자';
      current_caffeine: number;
      max_caffeine: number;
      updated_at: string;
    }>('/caffeine/info');
  },

  updateInfo: async (data: { weight_kg?: number; max_caffeine?: number }) => {
    return apiRequest<{
      message: string;
      caffeineInfo: {
        member_id: number;
        age: string;
        weight_kg: number;
        gender: '남자' | '여자';
        current_caffeine: number;
        max_caffeine: number;
        updated_at: string;
      };
    }>('/caffeine/info', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// 프로필 API
export const profileAPI = {
  getProfile: async () => {
    return apiRequest<{
      member_id: number;
      username: string;
      name: string;
      point: number;
      caffeineInfo: {
        member_id: number;
        age: string;
        weight_kg: number;
        gender: '남자' | '여자';
        current_caffeine: number;
        max_caffeine: number;
        updated_at: string;
      } | null;
    }>('/profile');
  },

  updateProfile: async (data: {
    name?: string;
    weight_kg?: number;
    max_caffeine?: number;
  }) => {
    return apiRequest<{
      message: string;
      profile: {
        member_id: number;
        username: string;
        name: string;
        point: number;
        caffeineInfo: {
          member_id: number;
          age: string;
          weight_kg: number;
          gender: '남자' | '여자';
          current_caffeine: number;
          max_caffeine: number;
          updated_at: string;
        } | null;
      };
    }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
