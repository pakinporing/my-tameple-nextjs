export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type LoginUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

type LoginResponseData = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  user: LoginUser;
};

export type RefreshResponseData = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
};

const API_BASE_URL = process.env.BACKEND_URL;

export async function requestLogin(
  email: string,
  password: string
): Promise<LoginResponseData> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Request failed');
  }

  const payload =
    (await response.json()) as ApiSuccessResponse<LoginResponseData>;
  if (!payload?.data?.user || !payload?.data?.accessToken) {
    throw new Error('Invalid login response');
  }

  return payload.data;
}

export async function requestRefresh(
  refreshToken: string
): Promise<RefreshResponseData> {
  console.log('runnnnnnnnnnnnnnnn');
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  console.log('resssss', response);
  if (!response.ok) {
    throw new Error('Request failed');
  }

  const payload =
    (await response.json()) as ApiSuccessResponse<RefreshResponseData>;
  return payload.data;
}

export async function requestLogout(refreshToken: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    throw new Error('Request failed');
  }
}

export async function requestRegister(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: Gender;
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Request failed');
  }
}

const refreshMap = new Map<string, Promise<RefreshResponseData>>();

export async function refreshOnce(refreshToken: string) {
  if (refreshMap.has(refreshToken)) {
    return refreshMap.get(refreshToken)!;
  }

  const refreshPromise = requestRefresh(refreshToken)
    .then((res) => res)
    .catch((err) => {
      console.log('errrr', err);
      throw err;
    })
    .finally(() => {
      // ❗ delay ลบ (กัน race หลัง refresh เสร็จ)
      setTimeout(() => {
        refreshMap.delete(refreshToken);
      }, 1000); // 👈 KEY สำคัญ
    });

  refreshMap.set(refreshToken, refreshPromise);

  return refreshPromise;
}
