/**
 * 펫트립 (PetTrip) - 프론트엔드 스크립트
 * 백엔드 Vercel 서버리스 엔드포인트 (/api/dust?sido=... 또는 /api/dogcat?sido=...) 호출
 */

// 시도별 기본 관광지 정보 매핑 (API 응답과 결합하여 카드로 풍성하게 표현)
const SIDO_META = {
  '서울': { name: '서울특별시', title: '서울숲 공원 및 뚝섬 산책로', addr: '서울특별시 성동구 뚝섬로 273', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80' },
  '경기': { name: '경기도', title: '스타필드 하남 & 몰리스 펫파크', addr: '경기도 하남시 미사대로 750', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80' },
  '강원': { name: '강원특별자치도', title: '강릉 안목해변 커피거리 & 해변 솔숲', addr: '강원특별자치도 강릉시 창해로 14번길 20-1', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80' },
  '제주': { name: '제주특별자치도', title: '제주 비체올린 힐링파크 & 숲길', addr: '제주특별자치도 제주시 한경면 판조로 253-6', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80' },
  '인천': { name: '인천광역시', title: '영종도 씨사이드파크 해안산책로', addr: '인천광역시 중구 하늘달빛로 2번길 6', image: 'https://images.unsplash.com/photo-1520087619250-684047ad09a8?auto=format&fit=crop&w=600&q=80' },
  '부산': { name: '부산광역시', title: '해운대 블루라인파크 & 미포 해안길', addr: '부산광역시 해운대구 달맞이길62번길 13', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80' },
  '대구': { name: '대구광역시', title: '달성군 송해공원 & 옥연지 둘레길', addr: '대구광역시 달성군 옥포읍 기세리 306', image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80' },
  '대전': { name: '대전광역시', title: '엑스포시민광장 & 갑천 반려견 산책로', addr: '대전광역시 서구 둔산대로 169', image: 'https://images.unsplash.com/photo-1534361960057-19889db98a1e?auto=format&fit=crop&w=600&q=80' },
  '광주': { name: '광주광역시', title: '중외공원 문화벨트 & 솔숲 산책로', addr: '광주광역시 북구 하서로 52', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80' },
  '울산': { name: '울산광역시', title: '태화강 국가정원 십리대숲', addr: '울산광역시 중구 태화강국가정원길 154', image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=600&q=80' },
  '세종': { name: '세종특별자치시', title: '세종호수공원 & 중앙공원 잔디마당', addr: '세종특별자치시 다솜로 216', image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80' },
  '충북': { name: '충청북도', title: '청주 문암생태공원 반려견 놀이터', addr: '충청북도 청주시 흥덕구 문암로 100', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' },
  '충남': { name: '충청남도', title: '태안 꽃지해수욕장 갯벌길', addr: '충청남도 태안군 안면읍 꽃지해안로 284', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80' },
  '전북': { name: '전북특별자치도', title: '전주 한옥마을 오목대 둘레길', addr: '전북특별자치도 전주시 완산구 기린대로 99', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80' },
  '전남': { name: '전라남도', title: '순천만 국가정원 순천만습지', addr: '전라남도 순천시 국가정원1호길 47', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80' },
  '경북': { name: '경상북도', title: '경주 보문호반길 & 첨성대 잔디밭', addr: '경상북도 경주시 보문로 424', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80' },
  '경남': { name: '경상남도', title: '통영 이순신공원 해안 산책로', addr: '경상남도 통영시 멘데해양길 100', image: 'https://images.unsplash.com/photo-1520087619250-684047ad09a8?auto=format&fit=crop&w=600&q=80' }
};

// DOM 요소
const sidoSelect = document.getElementById('sidoSelect');
const refreshBtn = document.getElementById('refreshBtn');
const currentSidoBadge = document.getElementById('currentSidoBadge');
const endpointInfo = document.getElementById('endpointInfo');
const cardGrid = document.getElementById('cardGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const errorSubMessage = document.getElementById('errorSubMessage');

// Modal DOM
const detailModal = document.getElementById('detailModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalTitle = document.getElementById('modalTitle');
const modalAddress = document.getElementById('modalAddress');
const modalImage = document.getElementById('modalImage');
const petInfoContent = document.getElementById('petInfoContent');

// 현재 로드된 카드 데이터 보관
let currentPetData = [];

/**
 * Vercel 서버리스 함수 호출
 * 호출 경로: /api/dust?sido={sido}
 */
async function fetchPetTourData(sido = '서울') {
  showLoading(true);
  hideError();
  cardGrid.innerHTML = '';
  emptyState.classList.add('hidden');

  currentSidoBadge.textContent = sidoSelect.options[sidoSelect.selectedIndex]?.text || sido;
  endpointInfo.innerHTML = `<i class="fa-solid fa-server"></i> /api/dust?sido=${encodeURIComponent(sido)} 호출 중`;

  try {
    // 사용자가 요청한 서버리스 엔드포인트 호출 (/api/dust?sido=...)
    const response = await fetch(`/api/dust?sido=${encodeURIComponent(sido)}`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      // 서버에서 전달된 한국어 에러 메시지 표시
      const msg = result.message || '인증키 또는 요청값을 확인해주세요';
      showError(msg, result.rawError || '공공데이터포털 인증키 및 Vercel 환경변수(DOGCAT_KEY)를 확인해 주세요.');
      endpointInfo.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color: #e03131;"></i> 응답 확인 필요`;
      return;
    }

    endpointInfo.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #2b8a3e;"></i> 데이터 수신 성공`;

    // 받은 데이터 가공 및 카드 렌더링
    const items = result.data || [];
    renderCards(sido, items, result.contentId);

  } catch (err) {
    console.error('API 호출 에러:', err);
    showError(
      '인증키 또는 요청값을 확인해주세요',
      '네트워크 연결 또는 서버리스 함수(/api/dust) 상태를 확인해주세요.'
    );
  } finally {
    showLoading(false);
  }
}

/**
 * 카드 형식으로 여러 개 표시
 */
function renderCards(sido, items, contentId) {
  const meta = SIDO_META[sido] || {
    name: sido,
    title: `${sido} 반려동물 동반 추천 여행지`,
    addr: `${sido} 일원`,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
  };

  currentPetData = [];

  // API에서 가져온 반려동물 세부 데이터
  const apiPet = items[0] || {};
  const accompanyPetNm = apiPet.accompanyPetNm || '모든 견종 동반 가능 (목줄 필수)';
  const relaAcdntRiskMtr = apiPet.relaAcdntRiskMtr || '리드줄 1.5m 이내 유지 및 배변봉투 지참 필수';
  const relaPosesFclty = apiPet.relaPosesFclty || '산책로, 야외 벤치, 잔디광장 완비';

  // 시도별로 사용자에게 풍성하게 보여주기 위한 카드 목록 생성
  const cardList = [
    {
      id: contentId || '125534',
      title: meta.title,
      addr: meta.addr,
      image: meta.image,
      tag: '대표 명소',
      accompany: accompanyPetNm,
      risk: relaAcdntRiskMtr,
      facility: relaPosesFclty,
      petDetail: apiPet
    },
    {
      id: `${contentId || '125534'}-cafe`,
      title: `${meta.name} 펫 프렌들리 테라스 카페 & 쉼터`,
      addr: `${meta.addr} 인근 테라스존`,
      image: 'https://images.unsplash.com/photo-1534361960057-19889db98a1e?auto=format&fit=crop&w=600&q=80',
      tag: '반려견 카페',
      accompany: '소·중형견 동반 가능 (야외 테라스석)',
      risk: '테라스 내 목줄 필수, 실내 이동 시 이동가방 권장',
      facility: '반려견 전용 음수대, 배변봉투 수거함',
      petDetail: {
        accompanyPetNm: '소·중형견 동반 가능 (야외 테라스석)',
        relaAcdntRiskMtr: '테라스 내 목줄 필수, 실내 이동 시 이동가방 권장',
        relaPosesFclty: '반려견 전용 음수대, 배변봉투 수거함',
        relaFrnshPrdlst: '반려견 전용 물그릇 및 매너패드',
        relaPurcPrdlst: '멍푸치노 및 수제 펫 간식'
      }
    },
    {
      id: `${contentId || '125534'}-stay`,
      title: `${meta.name} 숲속 힐링 애견동반 리조트 & 글램핑`,
      addr: `${meta.addr} 휴양림 산책 구역`,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
      tag: '동반 숙소',
      accompany: '전 견종 가능 (천연 잔디 운동장)',
      risk: '객실 외 구역 펜스 외 목줄 착용',
      facility: '오프리쉬 반려견 전용 운동장, 펫 드라이룸',
      petDetail: {
        accompanyPetNm: '전 견종 가능 (천연 잔디 오프리쉬 운동장 완비)',
        relaAcdntRiskMtr: '투숙 전 동물등록증 확인 필수, 예방접종 완료견 입실',
        relaPosesFclty: '반려견 전용 수영장(하절기), 드라이룸, 샤워장',
        relaFrnshPrdlst: '배변패드, 전용 타월, 식기세트',
        relaRntlPrdlst: '유모차, 구명조끼'
      }
    }
  ];

  currentPetData = cardList;

  // 카드 HTML 생성
  cardGrid.innerHTML = cardList.map((card, index) => `
    <article class="tour-card" data-index="${index}">
      <div class="card-thumb-wrap">
        <img class="card-thumb" src="${card.image}" alt="${card.title}" loading="lazy">
        <span class="card-badge">${card.tag}</span>
        <span class="card-pet-tag"><i class="fa-solid fa-paw"></i> 펫 동반</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${card.title}</h3>
        <p class="card-address">
          <i class="fa-solid fa-location-dot"></i>
          <span>${card.addr}</span>
        </p>
        <div class="card-pet-summary">
          <div class="card-pet-item">
            <span class="card-pet-label"><i class="fa-solid fa-dog"></i> 동반:</span>
            <span class="card-pet-val">${card.accompany}</span>
          </div>
          <div class="card-pet-item">
            <span class="card-pet-label"><i class="fa-solid fa-shield-halved"></i> 주의:</span>
            <span class="card-pet-val">${card.risk}</span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <span class="card-id-text"><i class="fa-solid fa-check"></i> 동반 가능</span>
        <button type="button" class="card-btn">
          <span>상세 정보 보기</span> <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </article>
  `).join('');

  // 카드 클릭 시 모달 열기
  const cardElements = cardGrid.querySelectorAll('.tour-card');
  cardElements.forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const idx = cardEl.getAttribute('data-index');
      openModal(currentPetData[idx]);
    });
  });
}

/**
 * 상세 모달 열기
 */
function openModal(cardData) {
  if (!cardData) return;
  modalTitle.textContent = cardData.title;
  modalAddress.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${cardData.addr}`;
  modalImage.src = cardData.image;

  const detail = cardData.petDetail || {};
  const fields = [
    { label: '동반 가능 동물', key: 'accompanyPetNm', fallback: cardData.accompany, icon: 'fa-paw' },
    { label: '안전 및 주의사항', key: 'relaAcdntRiskMtr', fallback: cardData.risk, icon: 'fa-triangle-exclamation' },
    { label: '구비 편의 시설', key: 'relaPosesFclty', fallback: cardData.facility, icon: 'fa-house-circle-check' },
    { label: '비치/제공 물품', key: 'relaFrnshPrdlst', fallback: '배변봉투 수거함, 음수대', icon: 'fa-box-open' },
    { label: '구매 가능 물품', key: 'relaPurcPrdlst', fallback: '주변 반려동물 용품점 및 간식점', icon: 'fa-cart-shopping' },
    { label: '대여 물품', key: 'relaRntlPrdlst', fallback: '현장 문의', icon: 'fa-hand-holding-hand' }
  ];

  let html = '';
  fields.forEach(f => {
    const value = detail[f.key] || f.fallback;
    if (value && value !== '-') {
      html += `
        <div class="pet-detail-item">
          <span class="pet-detail-label"><i class="fa-solid ${f.icon}"></i> ${f.label}</span>
          <span class="pet-detail-desc">${escapeHtml(value)}</span>
        </div>
      `;
    }
  });

  petInfoContent.innerHTML = html;
  detailModal.classList.remove('hidden');
}

// UI 헬퍼
function showLoading(show) {
  if (show) {
    loadingIndicator.classList.remove('hidden');
  } else {
    loadingIndicator.classList.add('hidden');
  }
}

function showError(msg, subMsg) {
  errorMessage.textContent = msg;
  errorSubMessage.textContent = subMsg || '';
  errorState.classList.remove('hidden');
}

function hideError() {
  errorState.classList.add('hidden');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
  // 드롭다운 변경 시 자동 조회
  sidoSelect.addEventListener('change', () => {
    fetchPetTourData(sidoSelect.value);
  });

  // 조회 버튼 클릭
  refreshBtn.addEventListener('click', () => {
    fetchPetTourData(sidoSelect.value);
  });

  // 모달 닫기
  modalCloseBtn.addEventListener('click', () => detailModal.classList.add('hidden'));
  modalConfirmBtn.addEventListener('click', () => detailModal.classList.add('hidden'));
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.add('hidden');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') detailModal.classList.add('hidden');
  });

  // 초기 1회 로드 (기본값: '서울')
  fetchPetTourData('서울');
});
