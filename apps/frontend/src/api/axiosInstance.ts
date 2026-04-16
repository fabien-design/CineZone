import axios from "axios";
import { navigate } from "@/lib/navigation";
import { toast } from "sonner";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
    (res) => {
        if (res.data?.message) {
            toast.success(res.data.message);
        }
        return res;
    },
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status !== 401 || originalRequest._retry) {
            toast.error(
                err.response?.data?.message ||
                    "An error occurred. Please try again.",
            );
            return Promise.reject(err);
        }

        if (isRefreshing) {
            return new Promise<void>((resolve) => {
                pendingQueue.push(resolve);
            }).then(() => api.request(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await axios.post(
                import.meta.env.VITE_API_URL + "/api/users/refresh-token",
                {},
                { withCredentials: true },
            );
            pendingQueue.forEach((resolve) => resolve());
            pendingQueue = [];
            return api.request(originalRequest);
        } catch {
            pendingQueue = [];
            const protectedRoutes = ["/profile", "/watchlist", "/favorites", "/admin"];
            const isProtected = protectedRoutes.some((r) =>
                window.location.pathname.startsWith(r),
            );
            if (isProtected) {
                toast.error(
                    err.response?.data?.message ||
                        "Session expired. Please log in again.",
                );
                const redirectTo = window.location.pathname + window.location.search;
                navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
            }
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    },
);

export default api;
