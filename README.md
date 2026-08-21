# 한끼로그

> 남아서 버리는 식재료를, 다음 한 끼로.

한끼로그는 한 번 산 식재료를 끝까지 활용할 수 있도록 레시피 선택, 식단 계획, 장보기, 조리, 남은 재료 활용을 하나의 흐름으로 연결한 iOS 앱입니다.

사용자가 먹고 싶은 메뉴를 고르면 필요한 양과 마트 판매 단위의 차이를 계산하고, 예산과 보유 재료를 함께 고려해 다음 식사까지 계획합니다. AI는 식단을 대신 결정하지 않습니다. 메뉴를 바꾸고 싶을 때 후보를 찾고 설명하는 역할만 맡으며, 수량·가격·예산·재고 계산은 Swift 코드가 처리합니다.

<p align="center">
  <img src="ios/qa/2026-08-19-final-ui/accepted/plan/14-home-with-plan.png" alt="한끼로그 홈" width="180">
  <img src="ios/qa/2026-08-19-final-ui/accepted/plan/05-plan-05-options.png" alt="식단안 선택" width="180">
  <img src="ios/qa/2026-08-19-final-ui/accepted/plan/13-care-2-shopping.png" alt="장보기 목록" width="180">
  <img src="ios/qa/2026-08-19-final-ui/accepted/share/04-share-chat.png" alt="재료 나눔 채팅" width="180">
</p>

## 주요 기능

- 레시피 검색, 필터, 상세 보기와 찜 목록
- 1~7일 식단과 날짜별 아침·점심·저녁 구성
- 목표 예산, 보유 재료, 불호·알레르기, 조리도구를 반영한 식단안 제안
- 재료별 필요량, 구매 포장 수, 예상 잔여량과 장보기 비용 계산
- 장보기 체크, 구매 재고 반영, 조리 완료와 남은 재료 차감
- 남은 재료의 보관 정보와 다음 레시피 추천
- 먹지 않은 식사의 이동, 교체, 비활성화와 삭제
- 동네 기반 재료 소분·공동구매, 참여 요청, 실시간 채팅과 약속 메모
- Google 계정 또는 기기 전용 계정으로 시작하는 온보딩

## 동작 방식

한끼로그의 계산은 같은 입력에 항상 같은 결과를 내도록 구성되어 있습니다.

```text
번들 레시피·가격 데이터 ─┐
사용자 식단·보유 재료 ───┼─> PlannerEngine ─> 식단안·장보기·예산·재고
선호·알레르기·조리도구 ─┘

식단 수정 요청 ─> Firebase callable function ─> OpenAI Responses API
                                          └─> 검증된 후보 레시피 ID만 앱에 반환
```

`PlannerEngine`이 재료 정규화, 단위 합산, 보유량 차감, 판매 단위 올림과 예산 계산을 담당합니다. 가격이나 단위 근거가 부족한 품목은 값을 추측하지 않고 사용자 확인 대상으로 남깁니다. 구매와 조리 완료는 같은 동작이 반복되어도 재고가 이중 반영되지 않도록 처리합니다.

AI 채팅은 서버에서만 OpenAI Platform과 통신합니다. 응답으로 받은 레시피 ID는 앱의 실제 카탈로그와 추천 조건을 다시 통과해야 하며, OpenAI API 키는 iOS 앱에 포함하지 않습니다.

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| iOS | Swift, SwiftUI, iOS 17+ |
| 상태·로컬 저장 | Observable 기반 AppStore, UserDefaults |
| 인증·데이터 | Firebase Authentication, Cloud Firestore |
| 서버 | Firebase Functions, Node.js 22 |
| AI 채팅 | OpenAI Responses API, JSON Schema 구조화 출력 |
| 위치 | Core Location, MapKit |
| 테스트 | XCTest, XCUITest, Firestore 보안 규칙 검증 |

Swift Package Manager로 `firebase-ios-sdk`와 `GoogleSignIn-iOS`를 사용합니다.

## 시작하기

### 요구 사항

- macOS와 Xcode 26.1.1 이상
- iOS 17 이상을 실행하는 Simulator 또는 iPhone
- Firebase 기능을 사용할 경우 Node.js 22와 Firebase CLI

### 앱 실행

```sh
git clone https://github.com/bodleim/OneLog.git
cd OneLog
open ios/OneLog/OneLog.xcodeproj
```

Xcode에서 `OneLog` scheme과 실행할 기기를 선택한 뒤 앱을 실행합니다. Swift Package Manager 의존성은 프로젝트를 열면 자동으로 내려받습니다.

Firebase가 연결되지 않아도 레시피 탐색, 식단 구성, 장보기와 재고 계산 같은 로컬 기능은 사용할 수 있습니다. Google 로그인, 여러 기기 사이의 재료 나눔·채팅, AI 식단 수정은 Firebase 설정이 필요합니다.

## Firebase 설정

자신의 Firebase 프로젝트에서 다음 기능을 활성화합니다.

- Authentication의 Anonymous 및 Google 제공업체
- Cloud Firestore
- Cloud Functions
- App Check

Firebase에 iOS 앱을 등록하고 발급받은 `GoogleService-Info.plist`를 `ios/OneLog/OneLogApp/`에 둡니다. Bundle ID와 URL scheme도 Firebase·Google 설정과 일치해야 합니다. 프로젝트 별칭은 Firebase CLI에서 연결할 수 있습니다.

```sh
firebase login
firebase use --add
npm --prefix functions ci
npm --prefix functions run check
firebase deploy --only firestore:rules
```

### AI 채팅 배포

OpenAI API 키는 저장소나 앱 설정 파일에 넣지 않고 Firebase Secret으로 등록합니다.

```sh
firebase functions:secrets:set OPENAI_API_KEY
firebase deploy --only functions:aiChat
```

나눔 요청 알림, 계정 삭제, 신고·문의 접수와 만료 글 정리까지 사용하려면 전체 Functions를 배포합니다.

```sh
firebase deploy --only functions
```

Debug 빌드는 App Check debug provider를 사용할 수 있습니다. 디버그 토큰은 로컬 Firebase 설정에만 등록하고 저장소나 로그에 남기지 마세요. Release 빌드는 App Attest와 APNs capability가 필요합니다.

## 레시피와 가격 데이터

앱은 실행 중 외부 레시피 API를 호출하지 않습니다. 식품의약품안전처 식품안전나라 `COOKRCP01` 데이터를 빌드 타임에 정리한 JSON과 프로젝트에서 관리하는 재료·판매 단위·가격 카탈로그를 앱 번들에서 읽습니다.

재료 데이터는 다음 원칙을 따릅니다.

- 질량, 부피, 개수는 변환 근거가 있을 때만 환산합니다.
- 대표 판매 단위와 가격이 없으면 구매량이나 예산을 임의로 만들지 않습니다.
- 원본 재료명과 앱에서 사용하는 정규화된 재료 ID를 분리합니다.
- 가격에는 단위, 출처, 확인 시점을 함께 보존합니다.

레시피 데이터를 다시 생성하려면 식품안전나라 API 키를 `FOODSAFETY_API_KEY` 환경 변수나 gitignore된 `ios/tools/.api_key`에 설정한 뒤 임포터를 실행합니다.

```sh
python3 ios/tools/import_recipes.py
```

## 테스트

설치된 Simulator 이름에 맞춰 destination을 바꿔 실행할 수 있습니다.

```sh
xcodebuild test \
  -project ios/OneLog/OneLog.xcodeproj \
  -scheme OneLog \
  -destination 'platform=iOS Simulator,name=iPhone 16e'
```

도메인 테스트는 재료 통합, 단위 충돌, 판매 단위 올림, 예산 완결성, 재고 멱등성, 추천 필터, 위치 좌표와 나눔 권한을 다룹니다. UI 테스트는 온보딩, 식단 생성, 장보기, 조리 완료, AI 후보 적용과 재료 나눔의 핵심 경로를 확인합니다.

Firebase Functions 문법은 로컬에서 확인할 수 있습니다. Firestore 검증 스크립트는 현재 연결된 Firebase 프로젝트에 테스트 데이터를 만들고 정리하며, 배포된 보안 규칙을 실제 서버 왕복으로 확인합니다.

```sh
npm --prefix functions run check
python3 ios/tools/check_firestore_rules.py
```

## 프로젝트 구조

```text
.
├── ios/OneLog/
│   ├── OneLogApp/          SwiftUI 앱, 도메인 모델과 데이터
│   ├── OneLogTests/        계산·저장·권한 도메인 테스트
│   └── OneLogUITests/      사용자 흐름과 화면 테스트
├── ios/tools/              레시피 임포터와 검증 도구
├── ios/firestore.rules     Firestore 보안 규칙
├── functions/              Firebase callable·trigger·scheduled functions
├── firebase.json           Firebase 배포 설정
└── AGENTS.md               제품 원칙, 구현 범위와 상세 현황
```

앱 코드의 주요 책임은 다음과 같이 나뉩니다.

- `PlannerEngine.swift`: 식단, 수량, 구매량, 가격과 예산 계산
- `AppStore.swift`: 앱 상태, 로컬 저장과 사용자 행동 연결
- `SeedData.swift`: 번들 레시피·재료·가격 데이터 로딩
- `ShareStore.swift`: Firestore 기반 나눔·요청·채팅 상태
- `AIChat.swift`: callable function 요청과 후보 검증

## 개인정보와 보안

- OpenAI API 키와 서비스 Secret은 클라이언트에 저장하지 않습니다.
- 위치는 재료 나눔 화면에서 필요할 때 한 번만 요청합니다.
- 서버에는 약 100m 격자로 반올림한 좌표만 저장하며, 이웃과의 예상 도보 시간을 표시하는 데만 사용합니다.
- 위치 권한을 거부해도 동네 이름으로 나눔 기능을 사용할 수 있습니다.
- 알레르기와 단순 불호를 별도로 저장하고 추천에서 다르게 처리합니다.
- 계정 탈퇴 시 사용자 데이터 삭제 경로를 제공합니다.

## 현재 상태

로컬 식단 계획과 결정론적 계산 흐름은 Simulator에서 실행할 수 있습니다. Firebase·OpenAI 연동도 구현되어 있지만, 자신의 Firebase 프로젝트와 서명 환경에서 Google OAuth 콜백, App Check, APNs, GPS 권한, 여러 실기기 간 실시간 동작을 별도로 확인해야 합니다.

TestFlight와 App Store 배포에는 App Attest·Push Notifications capability를 사용할 수 있는 Apple Developer Program 팀이 필요합니다. 기능별 구현 상태와 검증 기록은 [AGENTS.md](AGENTS.md)와 [`ios/qa`](ios/qa)에서 확인할 수 있습니다.

## 기여하기

버그 제보와 개선 제안은 Issue로 남겨 주세요. 코드 변경은 작은 단위의 Pull Request로 보내고, 변경 이유와 확인한 사용자 흐름 또는 테스트를 함께 적어 주세요.

특히 수량·단위·가격·예산·재고 로직을 수정할 때는 근거 없는 환산이나 가격 추정이 들어가지 않는지 확인하고 관련 도메인 테스트를 추가해야 합니다. 사용자 데이터 형식을 바꾸는 경우 기존 UserDefaults 데이터의 하위 호환도 함께 고려합니다.

## 데이터 출처

레시피 데이터는 식품의약품안전처 식품안전나라 조리식품 레시피 DB를 가공해 사용합니다.

- 출처: 식품의약품안전처 식품안전나라 `COOKRCP01`
- 이용 조건: 공공누리 제1유형(출처표시)

## 라이선스

현재 이 저장소에는 별도의 오픈소스 라이선스가 지정되어 있지 않습니다.
