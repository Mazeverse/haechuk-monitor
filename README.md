# 해축모니터 (Haechuk Monitor)

EPL·라리가·세리에A·분데스리가·리그1·K리그 뉴스를 하나의 화면에서 보는 모바일 우선 Next.js 뉴스 피드 MVP입니다.

## 포함된 기능
- 리그별 뉴스 탭 (전체 / EPL / 라리가 / 세리에A / 분데스 / 리그1 / K리그)
- Google News RSS 기반 최신 기사 자동 수집 (원본 피드 **30분 캐시**)
- 키워드 검색, 북마크(해당 브라우저에 저장), 원문 이동
- 페이지 **맨 아래** 제휴 배너 1개 (고정 광고 없음)
- PWA 기본 manifest/아이콘, 모바일 반응형
- DB, Cron, 외부 API 키 불필요

> 참고: 현재 버전은 **한국어 검색 기반 기사 수집**이며 AI 번역·요약 기능은 아직 없습니다. Google News RSS가 한국어 제목을 제공하는 경우 한국어로 보입니다. 뉴스는 매 30분 무조건 게시되는 구조가 아니라, 방문이 일어날 때 30분 캐시 만료분을 갱신하는 구조입니다. 뉴스 제공처 사정에 따라 수집이 실패할 수 있습니다. 완전한 백그라운드 수집/요약/원본 출처별 권리 확인은 2차 개발 사항입니다.

## Vercel 배포 (GitHub)
1. GitHub에 `haechuk-monitor` 저장소 생성 (README를 만들었다면 업로드 시 중복 조심).
2. 이 ZIP을 풀어 **폴더 내부 파일 전부**(app, components, lib, public, package.json 등)를 저장소 최상위에 업로드.
3. [Vercel](https://vercel.com/new) → Add New Project → GitHub 저장소 선택.
4. Framework: Next.js (자동 감지), Build Command: 기본값, Deploy.
5. 배포 주소: https://haechuk-monitor-pasm-xi.vercel.app/
6. 아틀레티코 마드리드 제휴 링크가 코드에 기본 적용되어 있습니다. 다른 링크로 바꾸려면 Vercel Project → Settings → Environment Variables에 `NEXT_PUBLIC_AFFILIATE_URL`을 추가하고 재배포하세요.

## 로컬 테스트
```bash
npm install
npm run dev
```
브라우저에서 http://localhost:3000 확인.

## 기술 및 주의점
- `GET /api/news?league=epl` API는 실시간 Google News RSS 결과를 읽고, Next fetch cache 1800초를 사용합니다.
- Google News RSS는 운영자가 통제할 수 없는 외부 서비스이며, 상업적 재이용 전 서비스 약관 및 기사 사용 범위를 확인하세요. 장기 운영 시 공식 RSS 제공 언론사와 이용권한이 확인된 API로 전환하는 것이 좋습니다.
- 제휴 링크는 `rel="sponsored"`로 표기하고 배너에 '제휴 안내'를 표시합니다. 공개 블로그나 앱에서는 제휴 수익 발생 가능성을 이용자가 알아볼 수 있게 명확히 고지하세요.
- `NEXT_PUBLIC_` 환경변수는 브라우저에 공개됩니다. 제휴 링크에는 사용 가능하지만 **API 비밀키를 절대 넣지 마세요**.
- 프론트 저장 북마크는 브라우저를 바꾸면 공유되지 않습니다.
- RSS 결과의 snippet은 제공처 텍스트입니다. 원문을 그대로 복제하지 않도록 전체 기사 저장은 하지 않습니다.

## 예정 작업
- 뉴스 출처·라이선스 검증 후 RSS 소스 개선
- AI 번역/짧은 한국어 요약 (비용 제한, 이용허가 범위 검토)
- 중복 기사 통합 및 공식 발표/루머 레이블
- 구단별 관심 뉴스, 별도 K리그1/2 탭

## 현재 적용된 사이트 / 제휴 링크
- 웹사이트: https://haechuk-monitor-pasm-xi.vercel.app/
- 트립닷컴 입장권 제휴: https://kr.trip.com/things-to-do/detail/109947208?Allianceid=4775205&SID=333720843&trip_sub1=해축모니터&trip_sub3=D20265177
- 본 제휴 링크는 트립닷컴에서 발급된 것으로, 실제 추적·수수료 지급 여부는 파트너 대시보드에서 확인하세요.
- Next.js 15.5.9 / React 19.1.2 보안 업데이트 반영.
