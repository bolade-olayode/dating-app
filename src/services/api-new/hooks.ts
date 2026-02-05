import { useQuery, useMutation, useInfiniteQuery, UseQueryOptions, UseMutationOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import apiClient from './client';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from './endpoints';
import { queryClient } from './QueryProvider';

// ============================================
// MESSAGE TYPES
// ============================================
export interface SenderMetadata {
	deviceName: string;
	deviceModel: string;
	city: string;
	country: string;
	networkProvider: string;
	longitude: number;
	latitude: number;
	browser: string;
	ipAddress: string;
	userAgent: string;
}

export interface Message {
	_id: string;
	recipientId: string;
	content: string;
	senderMetadata?: SenderMetadata;
	reaction: 'none' | 'positive' | 'negative' | 'superlike' | 'like';
	isRead: boolean;
	isAnonymous: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface MessageStats {
	totalSecrets: number;
	weeklyGrowth: string;
	sentimentPulse: {
		label: string;
		value: number;
		color: string;
		icon: string;
	}[];
	globalReach: {
		country: string;
		percentage: number;
		flag: string;
	}[];
}

export interface SendMessagePayload {
	recipientUsername: string;
	content: string;
	isAnonymous?: boolean;
}

// ============================================
// USER TYPES
// ============================================
export interface User {
	id: string;
	username: string;
	email: string;
	profilePicture?: string;
	bio?: string;
	createdAt: string;
}

export interface UpdateProfilePayload {
	username?: string;
	bio?: string;
	profilePicture?: string;
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================
export interface UserSubscription {
	plan: string;
	isPremium: boolean;
	subscription: any | null;
}

export interface VerifySubscriptionPayload {
	platform: 'ios' | 'android';
	productId: string;
	receiptData?: string; // for ios
	purchaseToken?: string | null; // for android
}

export interface RestoreSubscriptionPayload {
	platform: 'ios' | 'android';
	productId: string;
	receiptData?: string;
	purchaseToken?: string | null;
}

// ============================================
// MESSAGE HOOKS
// ============================================

/**
 * Fetch all messages for the current user
 */
export const useMessages = (options?: Omit<UseQueryOptions<Message[]>, 'queryKey' | 'queryFn'>) => {
	return useQuery<Message[]>({
		queryKey: ['messages'],
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<{ messages: Message[] }>>(API_ENDPOINTS.MESSAGES.LIST);
			return response.data.data.messages;
		},
		...options,
	});
};

/**
 * Fetch messages with infinite scroll support
 */
export const useInfiniteMessages = (limit = 20) => {
	return useInfiniteQuery({
		queryKey: ['messages', 'infinite'],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await apiClient.get<ApiResponse<{
				messages: Message[];
				pagination: {
					page: number;
					limit: number;
					total: number;
					totalPages: number;
				};
				unreadCount: number;
			}>>(`${API_ENDPOINTS.MESSAGES.LIST}?page=${pageParam}&limit=${limit}`);
			return response.data.data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.pagination.page < lastPage.pagination.totalPages) {
				return lastPage.pagination.page + 1;
			}
			return undefined;
		},
	});
};

/**
 * Fetch unread messages count
 */
export const useUnreadCount = (options?: Omit<UseQueryOptions<number>, 'queryKey' | 'queryFn'>) => {
	return useQuery<number>({
		queryKey: ['messages', 'unread-count'],
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>(API_ENDPOINTS.MESSAGES.LIST);
			return response.data.data.unreadCount;
		},
		...options,
	});
};

/**
 * Fetch a single message by ID
 */
export const useMessage = (id: string, options?: Omit<UseQueryOptions<Message>, 'queryKey' | 'queryFn'>) => {
	return useQuery<Message>({
		queryKey: ['message', id],
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<Message>>(API_ENDPOINTS.MESSAGES.GET(id));
			return response.data.data;
		},
		enabled: !!id,
		...options,
	});
};

/**
 * Send a new message
 */
export const useSendMessage = (options?: UseMutationOptions<Message, Error, SendMessagePayload>) => {
	return useMutation<Message, Error, SendMessagePayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<Message>>(
				API_ENDPOINTS.MESSAGES.SEND,
				payload
			);
			return response.data.data;
		},
		onSuccess: () => {
			// Invalidate messages list to refetch
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
		...options,
	});
};

/**
 * Mark messages as read (bulk or single)
 */
export const useMarkMessageRead = (options?: UseMutationOptions<void, Error, string | string[]>) => {
	return useMutation<void, Error, string | string[]>({
		mutationFn: async (ids) => {
			const messageIds = Array.isArray(ids) ? ids : [ids];
			await apiClient.post(API_ENDPOINTS.MESSAGES.MARK_READ, { messageIds });
		},
		onSuccess: (data, ids) => {
			queryClient.invalidateQueries({ queryKey: ['messages'] });
			const idArray = Array.isArray(ids) ? ids : [ids];
			idArray.forEach(id => {
				queryClient.invalidateQueries({ queryKey: ['message', id] });
			});
		},
		...options,
	});
};

/**
 * Update message reaction
 */
export const useUpdateReaction = (options?: UseMutationOptions<Message, Error, { id: string, reaction: 'positive' | 'negative' | 'superlike' }>) => {
	return useMutation<Message, Error, { id: string, reaction: 'positive' | 'negative' | 'superlike' }>({
		mutationFn: async ({ id, reaction }) => {
			const response = await apiClient.patch<ApiResponse<Message>>(
				API_ENDPOINTS.MESSAGES.REACTION(id),
				{ reaction }
			);
			return response.data.data;
		},
		onSuccess: (data, { id }) => {
			queryClient.invalidateQueries({ queryKey: ['messages'] });
			queryClient.invalidateQueries({ queryKey: ['message', id] });
		},
		...options,
	});
};

/**
 * Delete a message
 */
export const useDeleteMessage = (options?: UseMutationOptions<void, Error, string>) => {
	return useMutation<void, Error, string>({
		mutationFn: async (id) => {
			await apiClient.delete(API_ENDPOINTS.MESSAGES.DELETE(id));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
		...options,
	});
};

/**
 * Like/Unlike a message
 */
export const useLikeMessage = (options?: UseMutationOptions<Message, Error, string>) => {
	return useMutation<Message, Error, string>({
		mutationFn: async (id) => {
			const response = await apiClient.post<ApiResponse<Message>>(
				API_ENDPOINTS.MESSAGES.LIKE(id)
			);
			return response.data.data;
		},
		onSuccess: (data, id) => {
			// Update the specific message in cache
			queryClient.setQueryData<Message>(['message', id], data);
			// Invalidate messages list
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
		...options,
	});
};

/**
 * Fetch message statistics for the current user
 */
export const useMessageStats = (options?: Omit<UseQueryOptions<MessageStats>, 'queryKey' | 'queryFn'>) => {
	return useQuery<MessageStats>({
		queryKey: ['messages', 'stats'],
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<MessageStats>>(API_ENDPOINTS.MESSAGES.STATS);
			return response.data.data;
		},
		...options,
	});
};

// ============================================
// USER HOOKS
// ============================================

/**
 * Fetch current user profile
 */
export const useProfile = (options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) => {
	return useQuery<User>({
		queryKey: ['profile'],
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE);
			return response.data.data;
		},
		...options,
	});
};

/**
 * Update user profile
 */
export const useUpdateProfile = (options?: UseMutationOptions<User, Error, UpdateProfilePayload>) => {
	return useMutation<User, Error, UpdateProfilePayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.put<ApiResponse<User>>(
				API_ENDPOINTS.USER.UPDATE_PROFILE,
				payload
			);
			return response.data.data;
		},
		onSuccess: (data) => {
			// Update profile in cache
			queryClient.setQueryData<User>(['profile'], data);
		},
		...options,
	});
};

/**
 * Check if username is available
 */
export const useCheckUsername = (username: string, options?: Omit<UseQueryOptions<boolean>, 'queryKey' | 'queryFn'>) => {
	return useQuery<boolean>({
		queryKey: ['checkUsername', username],
		queryFn: async () => {
			const response = await apiClient.post<ApiResponse<{ available: boolean }>>(
				API_ENDPOINTS.USER.CHECK_USERNAME,
				{ username }
			);
			return response.data.data.available;
		},
		enabled: !!username && username.length >= 3,
		...options,
	});
};

// ============================================
// AUTHENTICATION HOOKS
// ============================================

export interface LoginPayload {
	email: string;
	password: string;
}

/**
 * Create anonymous account with device information
 */
export const useAnonymousSignup = (
	options?: UseMutationOptions<AnonymousSignupResponse, Error, AnonymousSignupPayload>
) => {
	return useMutation<AnonymousSignupResponse, Error, AnonymousSignupPayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<AnonymousSignupResponse>>(
				API_ENDPOINTS.AUTH.ANONYMOUS,
				payload
			);
			return response.data.data;
		},
		...options,
	});
};

/**
 * Get current authenticated user
 * Useful for checking if user is logged in and fetching their data
 */
export const useCurrentUser = (options?: Omit<UseQueryOptions<AnonymousUser>, 'queryKey' | 'queryFn'>) => {
	return useQuery<AnonymousUser>({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<AnonymousUser>>(API_ENDPOINTS.AUTH.ME);
			return response.data.data;
		},
		retry: false, // Don't retry if unauthorized
		staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
		...options,
	});
};

/**
 * Login user
 */
export interface RegisterPayload {
	username: string;
	email: string;
	password: string;
}

export interface Device {
	deviceId: string;
	deviceName: string;
	lastUsed: string;
	isActive: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export interface AnonymousUser {
	username: string;
	email?: string;
	isEmailVerified: boolean;
	devices: Device[];
	role: string;
	isAnonymous: boolean;
	status: boolean;
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface AnonymousSignupPayload {
	username: string;
	deviceId: string;
	deviceName: string;
	fcmToken?: string;
}

export interface AnonymousSignupResponse {
	user: AnonymousUser;
	token: string;
	usernameModified: boolean;
	isExistingUser: boolean;
}

export interface AuthResponse {
	user: User;
	token: string;
	refreshToken: string;
}

/**
 * Login user
 */
export const useLogin = (options?: UseMutationOptions<AuthResponse, Error, LoginPayload>) => {
	return useMutation<AuthResponse, Error, LoginPayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<AuthResponse>>(
				API_ENDPOINTS.AUTH.LOGIN,
				payload
			);
			return response.data.data;
		},
		...options,
	});
};

/**
 * Register new user
 */
export const useRegister = (options?: UseMutationOptions<AuthResponse, Error, RegisterPayload>) => {
	return useMutation<AuthResponse, Error, RegisterPayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<AuthResponse>>(
				API_ENDPOINTS.AUTH.REGISTER,
				payload
			);
			return response.data.data;
		},
		...options,
	});
};

/**
 * Logout user
 */
export const useLogout = (options?: UseMutationOptions<void, Error, void>) => {
	return useMutation<void, Error, void>({
		mutationFn: async () => {
			await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
		},
		onSuccess: () => {
			// Clear all queries on logout
			queryClient.clear();
		},
		...options,
	});
};

// ============================================
// EMAIL VERIFICATION HOOKS
// ============================================

export interface VerifyEmailRequestPayload {
	email: string;
}

export interface VerifyEmailConfirmPayload {
	email: string;
	code: string;
}

export interface VerifyEmailResponse {
	message: string;
	email?: string;
}

/**
 * Request email verification (send OTP)
 */
export const useRequestEmailVerification = (
	options?: UseMutationOptions<VerifyEmailResponse, Error, VerifyEmailRequestPayload>
) => {
	return useMutation<VerifyEmailResponse, Error, VerifyEmailRequestPayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
				API_ENDPOINTS.AUTH.VERIFY_EMAIL_REQUEST,
				payload
			);
			return response.data.data;
		},
		...options,
	});
};

/**
 * Confirm email verification (submit OTP)
 */
export const useConfirmEmailVerification = (
	options?: UseMutationOptions<VerifyEmailResponse, Error, VerifyEmailConfirmPayload>
) => {
	return useMutation<VerifyEmailResponse, Error, VerifyEmailConfirmPayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<VerifyEmailResponse>>(
				API_ENDPOINTS.AUTH.VERIFY_EMAIL_CONFIRM,
				payload
			);
			return response.data.data;
		},
		onSuccess: () => {
			// Invalidate current user to refetch updated email status
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
		},
		...options,
	});
};

export interface UpdatePushTokenPayload {
	deviceId: string;
	fcmToken: string;
}

/**
 * Update push notification token
 */
export const useUpdatePushToken = (options?: UseMutationOptions<void, Error, UpdatePushTokenPayload>) => {
	return useMutation<void, Error, UpdatePushTokenPayload>({
		mutationFn: async (payload) => {
			await apiClient.post(API_ENDPOINTS.AUTH.UPDATE_PUSH_TOKEN, payload);
		},
		...options,
	});
};

// ============================================
// SUBSCRIPTION HOOKS
// ============================================

/**
 * Fetch current user's subscription status
 */
export const useSubscriptionStatus = (options?: Omit<UseQueryOptions<UserSubscription>, 'queryKey' | 'queryFn'>) => {
	return useQuery<UserSubscription>({
		queryKey: ['subscription'],
		queryFn: async () => {
			const response = await apiClient.get<ApiResponse<UserSubscription>>(API_ENDPOINTS.SUBSCRIPTIONS.ME);
			return response.data.data;
		},
		...options,
	});
};

/**
 * Verify subscription receipt with the backend
 */
export const useVerifySubscription = (options?: UseMutationOptions<UserSubscription, Error, VerifySubscriptionPayload>) => {
	return useMutation<UserSubscription, Error, VerifySubscriptionPayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<UserSubscription>>(
				API_ENDPOINTS.SUBSCRIPTIONS.VERIFY,
				payload
			);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscription'] });
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
		},
		...options,
	});
};

/**
 * Restore subscription with the backend
 */
export const useRestoreSubscription = (options?: UseMutationOptions<UserSubscription, Error, RestoreSubscriptionPayload>) => {
	return useMutation<UserSubscription, Error, RestoreSubscriptionPayload>({
		mutationFn: async (payload) => {
			const response = await apiClient.post<ApiResponse<UserSubscription>>(
				API_ENDPOINTS.SUBSCRIPTIONS.RESTORE,
				payload
			);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['subscription'] });
			queryClient.invalidateQueries({ queryKey: ['currentUser'] });
		},
		...options,
	});
};
