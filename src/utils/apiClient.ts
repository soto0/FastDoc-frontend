import type { AxiosError } from 'axios';
import axios, { isAxiosError } from 'axios';
import { toast } from 'sonner';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ error: string; code: string; success: boolean }>) => {
        let message = 'Неизвестная ошибка';

        if (isAxiosError(error)) {
            message = error.response?.data?.error ?? error.message;
        }

        toast.error('Ошибка', { description: message });

        return Promise.reject(error);
    }
);
