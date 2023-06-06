import NetworkError from '@/components/organisms/Error/NetworkError';
import React from 'react';

class ApiErrorBoundary extends React.Component {
  state: { shouldHandleError: boolean; shouldRethrow: boolean; error: any };

  constructor(props: any) {
    super(props);
    this.state = {
      shouldHandleError: false,
      shouldRethrow: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
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
    console.log(this.state.error);
    if (this.state.shouldRethrow) {
      throw this.state.error;
    }
    if (!this.state.shouldHandleError) {
      //@ts-ignore
      return this.props.children;
    }
    if (this.state.error?.message) {
      return <NetworkError />;
    }
    //@ts-ignore
    return this.props.children;
  }
}

export default ApiErrorBoundary;
