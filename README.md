# 펫트립 (PetTrip) 🐾

한국관광공사 국문 관광정보 서비스(`KorService2`) 공공데이터 API를 활용한 전국 반려동물 동반 여행 정보 반응형 웹앱입니다.

## 📌 주요 기능
- **지역별 드롭다운 필터링**: 서울, 경기, 강원, 제주 등 17개 시/도 지역별 반려동물 동반 가능 여행지 확인
- **Vercel 서버리스 아키텍처**: API 인증키를 프론트엔드에 노출하지 않고 안전하게 프록시 처리 (`/api/dust?sido=...` 및 `/api/dogcat?sido=...`)
- **반려동물 상세 정보 카드 & 모달**: 동반 가능 견종, 목줄 착용 규정, 편의 시설, 비치 물품 등 확인
- **한국어 에러 핸들링**: 공공데이터포털 XML 에러 및 인증키 실패 시 친절한 한국어 안내 메시지 반환
- **반응형 웹 디자인**: 모바일, 태블릿, 데스크톱 PC 등 모든 디바이스 최적화 레이아웃

## 🛠️ 기술 스택
- **Frontend**: HTML5, CSS3 (Grid & Flexbox), Vanilla JavaScript (ES6+)
- **Backend / Serverless**: Vercel Serverless Functions (Node.js)
- **External API**: 한국관광공사 국문 관광정보 서비스_GW (`KorService2/detailPetTour1`)

## 🚀 배포 및 환경변수 설정 (Vercel)
1. Vercel 프로젝트 대시보드로 이동합니다.
2. **Settings** > **Environment Variables** 메뉴에서 다음 환경변수를 추가합니다:
   - **Key**: `DOGCAT_KEY`
   - **Value**: 공공데이터포털(data.go.kr)에서 발급받은 **Encoding 인증키**
3. Deploy 완료 후 배포된 도메인에서 즉시 이용 가능합니다.

## 📂 프로젝트 구조
```text
├── api/
│   ├── dogcat.js      # Vercel 서버리스 함수 (공공데이터 API 통신 및 에러 핸들링)
│   └── dust.js        # /api/dust 엔드포인트 호환 핸들러
├── index.html         # 웹앱 메인 화면
├── script.js          # 프론트엔드 API 호출 및 동적 카드 렌더링 로직
├── style.css          # 반응형 디자인 및 스타일시트
├── .env.local         # 로컬 환경변수 (Git 제외)
├── .gitignore         # 민감 정보(.env.local 등) 깃 제외 설정
└── README.md          # 프로젝트 문서
```
