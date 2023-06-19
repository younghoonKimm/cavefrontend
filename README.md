## 59mins 리뉴얼

next, typescript를 통한 리뉴얼 작업 예정
**service 로직 단위 unit test 추가 목표**

<br/>

### CheckList

- [x] **Auth**
- [x] User
- [ ] Meeting
- [ ] Agenda
  - [ ] Category
- [ ] Friend
- [ ] Mail
- [ ] Notification
- [ ] Socket Room

## unit test

- [ ] Auth
  - [ ] sign in
  - [ ] sign out
  - [ ] token refresh
- [ ] User
  - [ ] invite
- [ ] Agenda
  - [ ] Category
- [ ] Friend
- [ ] Mail
- [ ] Notification
- [ ] Socket Room

## 계획

### 개발기간

2023.06 러프하게 기능 논의, 개발 스펙 선택 중
2023.07 기획 완료 예정
2023.07 디자인 작업
2023.07 ~ 2024.01로 예상

### Recoil

이전 컬러버스앱 프로젝트에선 React-query + jotai의 조합을 사용하였는데 Recoil을 사용하는 곳이 더 많아 보여서 러닝커브가 그렇게 높지 않아 보여 Recoil로 상태 관리를 하려고 한다.

### 에러 처리

```js
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
  ApiErrorBoundaryType,
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
      console.log(error);
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
```

현재 계획은 APIErrorboundary들로 감싸서 해당 페이지 API단에서 발생하는 에러들을 처리할 생각이고 그 이외 크리티컬 하거나 공통적인 error는 상위 Errorboundary로 처리 예정
