import { AxiosError } from 'axios';
import React from 'react';
import NetworkError from '@/components/organisms/Error/NetworkError';

interface ApiErrorBoundaryType {
  shouldHandleError: boolean;
  shouldRethrow: boolean;
  error: AxiosError | Error | null;
}

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
}

class ApiErrorBoundary extends React.Component<
  ApiErrorBoundaryProps,
  ApiErrorBoundaryType
> {
  constructor(props: { children: any }) {
    super(props);
    this.state = {
      shouldHandleError: false,
      shouldRethrow: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryType {
    if (error) {
      return {
        // 여기서 처리 할 수 없는 에러라면 render 단계에서 rethrow 하여 상위 에러 바운더리에서 처리
        shouldHandleError: true,
        shouldRethrow: false,
        error: error,
      };
    }

    return {
      shouldHandleError: false,
      shouldRethrow: false,
      error: null,
    };
  }

  render() {
    if (this.state.shouldRethrow) {
      throw this.state.error;
    }
    if (!this.state.shouldHandleError) {
      return this.props.children;
    }
    if (this.state.error?.message) {
      return <NetworkError />;
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
