// Vercel Serverless Function: api/dogcat.js
// 한국관광공사 국문 관광정보 서비스_GW (반려동물 동반 여행 정보) 프록시

// 시도별 기본 대표 contentId 매핑 (사용자가 sido만 넘겼을 때도 적절한 반려동물 여행 정보를 조회할 수 있도록 지원)
const SIDO_CONTENT_MAP = {
  '서울': '125534',
  '경기': '2704518',
  '강원': '2789123',
  '제주': '2901928',
  '부산': '3012948',
  '인천': '3129384',
  '대구': '3201948',
  '대전': '2541901',
  '광주': '2601112',
  '울산': '3129384',
  '세종': '2731802',
  '충북': '2541901',
  '충남': '2541901',
  '전북': '2934812',
  '전남': '2934812',
  '경북': '3201948',
  '경남': '3012948'
};

export default async function handler(req, res) {
  // CORS 및 캐시 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. 주소 쿼리에서 sido(시도 이름) 추출 (기본값: '서울')
  const sido = (req.query.sido || '서울').trim();
  const requestedContentId = req.query.contentId || req.query.contentID;
  const targetContentId = requestedContentId || SIDO_CONTENT_MAP[sido] || '125534';
  const pageNo = req.query.pageNo || '1';
  const numOfRows = req.query.numOfRows || '10';

  // 2. 환경변수 DOGCAT_KEY 읽기 (코드 내에 절대 하드코딩 금지)
  const rawKey = process.env.DOGCAT_KEY;

  if (!rawKey) {
    return res.status(500).json({
      success: false,
      message: '서버 환경변수 DOGCAT_KEY가 설정되지 않았습니다. Vercel 또는 .env.local 설정을 확인해주세요.'
    });
  }

  // 3. 환경변수의 Encoding 키를 encodeURIComponent로 인코딩하여 주소에 연결
  const encodedKey = encodeURIComponent(rawKey);

  // 한국관광공사 국문 관광정보 서비스 반려동물 정보 엔드포인트
  // 지정 파라미터: _type=json, numOfRows=10, pageNo=1, MobileOS=ETC, MobileApp=dogcat, contentID=125534, ver=1.3
  const baseUrl = 'https://apis.data.go.kr/B551011/KorService2/detailPetTour1';
  const queryParams = [
    `serviceKey=${encodedKey}`,
    `_type=json`,
    `numOfRows=${encodeURIComponent(numOfRows)}`,
    `pageNo=${encodeURIComponent(pageNo)}`,
    `MobileOS=ETC`,
    `MobileApp=dogcat`,
    `contentId=${encodeURIComponent(targetContentId)}`,
    `ver=1.3`
  ].join('&');

  const targetUrl = `${baseUrl}?${queryParams}`;

  try {
    const apiResponse = await fetch(targetUrl);
    const textData = await apiResponse.text();

    // 4. 응답이 JSON이 아니라 XML 에러로 올 경우 한국어 안내 메시지 반환
    const trimmedText = textData.trim();
    if (trimmedText.startsWith('<') || trimmedText.includes('<?xml') || trimmedText.includes('<OpenAPI_ServiceResponse>')) {
      return res.status(400).json({
        success: false,
        message: '인증키 또는 요청값을 확인해주세요. (공공데이터포털 인증키 승인 여부 및 Encoding 키 확인이 필요합니다)',
        rawError: trimmedText
      });
    }

    // 5. JSON 파싱
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch (parseError) {
      return res.status(502).json({
        success: false,
        message: '공공데이터 서버로부터 올바른 JSON 응답을 받지 못했습니다. 인증키 또는 요청값을 확인해주세요.'
      });
    }

    // 6. 응답 본문 안의 resultCode 성공 여부 확인 ('0000' 또는 '00'이 공공데이터 정상 코드)
    const header = jsonData?.response?.header;
    const resultCode = header?.resultCode;
    const resultMsg = header?.resultMsg || '알 수 없는 오류';

    if (resultCode && resultCode !== '0000' && resultCode !== '00') {
      let customKoreanMsg = `공공데이터 API 오류: ${resultMsg} (코드: ${resultCode})`;
      if (resultCode === '30' || resultCode === '01') {
        customKoreanMsg = '인증키가 유효하지 않거나 등록되지 않았습니다. 환경변수 DOGCAT_KEY를 확인해주세요.';
      } else if (resultCode === '22') {
        customKoreanMsg = 'API 호출 제한(트래픽 초과)이 발생했습니다.';
      }

      return res.status(400).json({
        success: false,
        message: customKoreanMsg,
        resultCode: resultCode
      });
    }

    // 성공 응답 반환 (요청된 시도 정보 포함)
    const items = jsonData?.response?.body?.items?.item || [];
    const itemArray = Array.isArray(items) ? items : (items ? [items] : []);

    return res.status(200).json({
      success: true,
      sido: sido,
      contentId: targetContentId,
      totalCount: jsonData?.response?.body?.totalCount || itemArray.length,
      data: itemArray,
      raw: jsonData
    });

  } catch (networkError) {
    return res.status(500).json({
      success: false,
      message: `공공데이터 서버 통신 실패: ${networkError.message}`
    });
  }
}
