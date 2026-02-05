# API Integration Setup

This directory contains the API integration layer using **TanStack Query (React Query)** and **Axios**.

## 📁 Structure

```
lib/api/
├── client.ts          # Axios instance with interceptors
├── endpoints.ts       # API endpoint definitions
├── hooks.ts          # React Query hooks for API calls
└── QueryProvider.tsx # React Query provider setup
```

## 🚀 Quick Start

### 1. Environment Setup

Update your `.env` file with your API base URL:

```env
EXPO_PUBLIC_API_BASE_URL=https://api.yourapp.com/v1
EXPO_PUBLIC_API_TIMEOUT=30000
```

### 2. Using API Hooks

The hooks are already integrated into your app. Here's how to use them:

#### Fetching Data (Queries)

```tsx
import { useMessages, useProfile } from '@/lib/api/hooks';

function MessagesScreen() {
  const { data: messages, isLoading, error } = useMessages();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <View>
      {messages?.map(msg => <MessageCard key={msg.id} message={msg} />)}
    </View>
  );
}
```

#### Sending Data (Mutations)

```tsx
import { useSendMessage } from '@/lib/api/hooks';

function SendMessageForm() {
  const sendMessage = useSendMessage({
    onSuccess: (data) => {
      console.log('Message sent!', data);
    },
    onError: (error) => {
      console.error('Failed to send:', error);
    },
  });

  const handleSend = () => {
    sendMessage.mutate({
      recipientUsername: 'alex_vibes',
      content: 'Hello!',
      isAnonymous: true,
    });
  };

  return (
    <Button 
      onPress={handleSend} 
      loading={sendMessage.isPending}
    >
      Send Message
    </Button>
  );
}
```

## 📚 Available Hooks

### Messages
- `useMessages()` - Fetch all messages
- `useMessage(id)` - Fetch single message
- `useSendMessage()` - Send a message
- `useDeleteMessage()` - Delete a message
- `useLikeMessage()` - Like/unlike a message

### User
- `useProfile()` - Get current user profile
- `useUpdateProfile()` - Update profile
- `useCheckUsername(username)` - Check username availability

### Authentication
- `useLogin()` - Login user
- `useRegister()` - Register new user
- `useLogout()` - Logout user

## 🔐 Authentication

To add authentication tokens, update `lib/api/client.ts`:

```typescript
// In the request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

## 🎯 Adding New Endpoints

1. **Add endpoint to `endpoints.ts`:**
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
  },
};
```

2. **Create hook in `hooks.ts`:**
```typescript
export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.POSTS.LIST);
      return response.data.data;
    },
  });
};
```

## 🔄 Cache Management

React Query automatically handles caching. Configure in `QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
      gcTime: 10 * 60 * 1000,   // Cache kept for 10 minutes
    },
  },
});
```

## 🛠️ Error Handling

Errors are automatically handled in the axios interceptor. Customize in `client.ts`:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Custom error handling
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

## 📖 Best Practices

1. **Use query keys consistently** - They're used for caching and invalidation
2. **Invalidate queries after mutations** - Keeps data fresh
3. **Handle loading and error states** - Provide good UX
4. **Use optimistic updates** - For instant feedback
5. **Leverage stale-while-revalidate** - Show cached data while fetching fresh data

## 🔗 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
