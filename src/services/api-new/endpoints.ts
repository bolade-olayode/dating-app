// API Endpoints Configuration
export const API_ENDPOINTS = {
	// Authentication
	AUTH: {
		ANONYMOUS: '/auth/anonymous',
		ME: '/auth/me',
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		LOGOUT: '/auth/logout',
		REFRESH_TOKEN: '/auth/refresh',
		VERIFY_EMAIL_REQUEST: '/auth/verify-email/request',
		VERIFY_EMAIL_CONFIRM: '/auth/verify-email/confirm',
		FORGOT_PASSWORD: '/auth/forgot-password',
		RESET_PASSWORD: '/auth/reset-password',
		UPDATE_PUSH_TOKEN: '/auth/devices/fcm-token',
	},

	// User
	USER: {
		PROFILE: '/user/profile',
		UPDATE_PROFILE: '/user/profile',
		CHANGE_PASSWORD: '/user/change-password',
		DELETE_ACCOUNT: '/user/delete',
		CHECK_USERNAME: '/user/check-username',
	},

	// Messages
	MESSAGES: {
		LIST: '/messages',
		GET: (id: string) => `/messages/${id}`,
		SEND: '/messages',
		DELETE: (id: string) => `/messages/${id}`,
		MARK_READ: '/messages/mark-read',
		LIKE: (id: string) => `/messages/${id}/like`,
		REACTION: (id: string) => `/messages/${id}/reaction`,
		STATS: '/messages/stats',
	},

	// Notifications
	NOTIFICATIONS: {
		LIST: '/notifications',
		MARK_READ: (id: string) => `/notifications/${id}/read`,
		MARK_ALL_READ: '/notifications/mark-all-read',
		DELETE: (id: string) => `/notifications/${id}`,
	},

	// Settings
	SETTINGS: {
		GET: '/settings',
		UPDATE: '/settings',
		PRIVACY: '/settings/privacy',
		NOTIFICATIONS: '/settings/notifications',
	},

	// Subscriptions
	SUBSCRIPTIONS: {
		ME: '/subscriptions/me',
		VERIFY: '/subscriptions/verify',
		RESTORE: '/subscriptions/restore',
	},
} as const;

// API Response Types
export interface ApiResponse<T = any> {
	success: boolean;
	data: T;
	message?: string;
}

export interface PaginatedResponse<T = any> {
	success: boolean;
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface ApiError {
	success: false;
	message: string;
	errors?: Record<string, string[]>;
}
