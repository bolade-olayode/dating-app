import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { useSubscriptionStatus, useVerifySubscription } from '../api/hooks';
import Constants from 'expo-constants';

// Types from react-native-iap (safe to import as types)
import type { Product, Purchase } from 'react-native-iap';

// Native modules check for Expo Go friendliness
const isExpoGo = Constants.appOwnership === 'expo';

const MOCK_PRODUCTS: Product[] = [
	{
		productId: 'weekly_premium',
		title: 'Weekly Premium (Mock)',
		description: 'Unlock all features for one week',
		price: '3.99',
		currency: 'USD',
		localizedPrice: '$3.99',
		type: 'subs',
	} as any,
	{
		productId: 'monthly_premium',
		title: 'Monthly Premium (Mock)',
		description: 'Unlock all features for one month',
		price: '9.99',
		currency: 'USD',
		localizedPrice: '$9.99',
		type: 'subs',
	} as any,
	{
		productId: 'yearly_premium',
		title: 'Yearly Premium (Mock)',
		description: 'Unlock all features for one year',
		price: '29.99',
		currency: 'USD',
		localizedPrice: '$29.99',
		type: 'subs',
	} as any,
];

const itemSkus = Platform.select({
	ios: ['weekly_premium', 'monthly_premium', 'yearly_premium'],
	android: ['weekly_premium', 'monthly_premium', 'yearly_premium'],
}) || [];

export const useSubscription = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);

	const { data: status, isLoading: isStatusLoading, refetch: refetchStatus } = useSubscriptionStatus();
	const verifySubscription = useVerifySubscription();

	// Initialize IAP
	useEffect(() => {
		let purchaseUpdateSubscription: any;
		let purchaseErrorSubscription: any;

		const initIAP = async () => {
			if (isExpoGo) {
				console.log('Running in Expo Go: Using mock products and subscription behaviors.');
				setProducts(MOCK_PRODUCTS);
				setIsInitializing(false);
				return;
			}
			
			try {
				const { initConnection, fetchProducts } = require('react-native-iap');
				await initConnection();
				
				const fetched = await fetchProducts({ skus: itemSkus, type: 'subs' });
				if (fetched) {
					setProducts(fetched);
				}
				setIsInitializing(false);
			} catch (err) {
				console.error('IAP Initialization Error:', err);
				setIsInitializing(false);
			}
		};

		initIAP();

		if (!isExpoGo) {
			const { purchaseUpdatedListener, purchaseErrorListener, finishTransaction } = require('react-native-iap');
			
			purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
				const receipt = purchase.purchaseToken;
				
				if (receipt) {
					try {
						setIsLoading(true);
						await verifySubscription.mutateAsync({
							platform: Platform.OS === 'ios' ? 'ios' : 'android',
							productId: purchase.productId,
							...(Platform.OS === 'ios' 
								? { receiptData: purchase.purchaseToken as string } 
								: { purchaseToken: purchase.purchaseToken }
							),
						});

						await finishTransaction({ purchase, isConsumable: false });
						await refetchStatus();
						Alert.alert('Success', 'Subscription activated!');
					} catch (err: any) {
						console.error('Verification Error:', err);
						Alert.alert('Error', err.message || 'Failed to verify subscription with the server.');
					} finally {
						setIsLoading(false);
					}
				}
			});

			purchaseErrorSubscription = purchaseErrorListener((error: any) => {
				const { ErrorCode } = require('react-native-iap');
				console.warn('Purchase Error:', error);
				if (error.code !== (ErrorCode.UserCancelled as any) && error.code !== ('E_USER_CANCELLED' as any)) {
					Alert.alert('Purchase Error', error.message);
				}
				setIsLoading(false);
			});
		}

		return () => {
			if (purchaseUpdateSubscription) purchaseUpdateSubscription.remove();
			if (purchaseErrorSubscription) purchaseErrorSubscription.remove();
			if (!isExpoGo) {
				const { endConnection } = require('react-native-iap');
				endConnection();
			}
		};
	}, []);

	const subscribe = async (productId: string) => {
		if (isExpoGo) {
			Alert.alert('Expo Go Mode', 'Actual purchases require a Development Build.', [{ text: 'OK' }]);
			return;
		}

		try {
			setIsLoading(true);
			const { requestPurchase } = require('react-native-iap');
			await requestPurchase({
				type: 'subs',
				request: Platform.select({
					ios: { apple: { sku: productId } },
					android: { google: { skus: [productId] } }
				}) as any
			});
		} catch (err: any) {
			const { ErrorCode } = require('react-native-iap');
			console.error('Purchase Request Error:', err);
			if (err.code !== (ErrorCode.UserCancelled as any) && err.code !== ('E_USER_CANCELLED' as any)) {
				Alert.alert('Error', err.message || 'Failed to initiate purchase.');
			}
			setIsLoading(false);
		}
	};

	const restorePurchases = async () => {
		if (isExpoGo) {
			Alert.alert('Expo Go Mode', 'Restore logic is mocked in Expo Go.');
			return;
		}

		try {
			setIsLoading(true);
			const { getAvailablePurchases } = require('react-native-iap');
			const purchases = await getAvailablePurchases();
			
			if (purchases && purchases.length > 0) {
				const sortedPurchases = [...purchases].sort((a, b) => (b.transactionDate || 0) - (a.transactionDate || 0));
				const latestPurchase = sortedPurchases.find(p => itemSkus.includes(p.productId));

				if (latestPurchase) {
					await verifySubscription.mutateAsync({
						platform: Platform.OS === 'ios' ? 'ios' : 'android',
						productId: latestPurchase.productId,
						...(Platform.OS === 'ios' 
							? { receiptData: latestPurchase.purchaseToken as string } 
							: { purchaseToken: latestPurchase.purchaseToken }
						),
					});
					await refetchStatus();
					Alert.alert('Restored', 'Your subscription has been successfully restored.');
				} else {
					Alert.alert('Restore', 'No active subscriptions found to restore.');
				}
			} else {
				Alert.alert('Restore', 'No previous purchases found.');
			}
		} catch (err: any) {
			console.error('Restore Error:', err);
			Alert.alert('Error', err.message || 'Failed to restore purchases.');
		} finally {
			setIsLoading(false);
		}
	};

	return {
		products,
		status,
		isPremium: status?.isPremium || false,
		isLoading: isLoading || isStatusLoading,
		isInitializing,
		subscribe,
		restorePurchases,
		refetchStatus,
	};
};
