import { AxiosError } from 'axios';
import React from 'react';
import NetworkError from '@/components/organisms/Error/NetworkError';

interface ApiErrorBoundaryState {
  shouldHandleError: boolean;
  shouldRethrow: boolean;
  error: AxiosError | Error | null;
}

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
}

class ApiErrorBoundary extends React.Component<
  ApiErrorBoundaryProps,
  ApiErrorBoundaryState
> {
  constructor(props: { children: any }) {
    super(props);
    this.state = {
      shouldHandleError: false,
      shouldRethrow: false,
      error: null,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // 하위의 자손 컴포넌트에서 오류가 발생했을 때 commit 단계에서 호출
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    console.error('Uncaught error:', error, errorInfo);
  }

  static getDerivedStateFromError(error: AxiosError): ApiErrorBoundaryState {
    console.log(error);
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
