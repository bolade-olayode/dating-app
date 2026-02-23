// src/components/common/ErrorBoundary.tsx
// Catches unhandled JS errors anywhere in the component tree and shows a
// friendly recovery screen instead of a white blank crash.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you'd send this to Sentry / Crashlytics
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😕</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            An unexpected error occurred. Please try again.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#999',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#FF007B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 50,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
