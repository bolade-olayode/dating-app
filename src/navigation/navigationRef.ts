// src/navigation/navigationRef.ts
// Allows navigation from outside React components (e.g. Axios interceptors, services).

import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
