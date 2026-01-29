/**
 * OCR 모듈 - Claude Vision API 연동
 */

const OCRService = {
    apiKey: '', // 앱에서 설정
    dispensedDrugs: [], // 조제 약물 목록

    /**
     * 조제 약물 목록 로드
     */
    async loadDispensedDrugs() {
        try {
            const response = await fetch('js/dispensed-drugs.json');
            this.dispensedDrugs = await response.json();
            console.log(`[OCR] 조제 약물 목록 로드: ${this.dispensedDrugs.length}개`);
        } catch (e) {
            console.error('[OCR] 조제 약물 목록 로드 실패:', e);
            this.dispensedDrugs = [];
        }
    },

    /**
     * API 키 설정
     */
    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('anthropic_api_key', key);
    },

    /**
     * 저장된 API 키 로드
     */
    loadApiKey() {
        this.apiKey = localStorage.getItem('anthropic_api_key') || '';
        return this.apiKey;
    },

    /**
     * 처방전 이미지에서 정보 추출
     */
    async extractPrescription(imageBase64) {
        if (!this.apiKey) {
            throw new Error('API 키가 설정되지 않았습니다.');
        }

        // base64 데이터 URL에서 실제 데이터만 추출
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        // 약물 목록 준비 (프롬프트에 포함)
        const drugListForPrompt = this.dispensedDrugs.length > 0
            ? `\n\n[이 약국에서 사용하는 약물 목록 - 반드시 이 목록에서 가장 유사한 이름으로 매칭]\n${this.dispensedDrugs.join(', ')}`
            : '';

        // 오늘 날짜 (나이 계산용)
        const today = new Date();
        const todayStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

        const prompt = `처방전 이미지를 분석하여 다음 정보를 JSON으로 추출하세요.
오늘 날짜: ${todayStr}

{
  "patient": {
    "name": "환자명 (없으면 null)",
    "age_months": 나이(개월 수),
    "weight_kg": 체중(kg)
  },
  "prescriptions": [
    {
      "drug_name": "약물명 (아래 목록에서 가장 유사한 이름으로)",
      "dose": 1회 용량 숫자만,
      "dose_unit": "용량 단위 (mL, mg, 정 등)",
      "frequency": 1일 투여 횟수 (숫자만),
      "duration": 투여 기간 일수 (없으면 null)
    }
  ],
  "hospital": "병원명",
  "doctor": "의사명",
  "date": "처방일 (YYYY-MM-DD)"
}

[환자 정보 추출 규칙]

1. 체중 (weight_kg):
   - 처방전 좌측 상단에 손글씨로 적힌 숫자가 체중(kg)입니다
   - 예: "15", "12.5" 등
   - 없으면 null

2. 나이 (age_months):
   - 주민등록번호 앞 6자리(YYMMDD)에서 생년월일을 추출하여 오늘 날짜 기준 개월 수 계산
   - YY가 00~25이면 2000년대생 (예: 230515 → 2023년 5월 15일생)
   - YY가 26~99이면 1900년대생 (예: 850101 → 1985년 1월 1일생)
   - 계산: (오늘 연도 - 출생 연도) × 12 + (오늘 월 - 출생 월)
   - 주민번호가 없으면 처방전에 기재된 나이 사용 (3세=36, 6개월=6)

[약물 인식 규칙]
- 약물명은 반드시 아래 약물 목록에서 가장 유사한 이름을 선택
- 처방전의 약물명이 목록과 정확히 일치하지 않아도 가장 가까운 것으로 매칭
- 용량 단위는 mL, mg, 정, 캡슐 등 명확히
- 읽기 어려운 글자는 약물 목록을 참고하여 추정

JSON만 출력하세요.${drugListForPrompt}`;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-opus-4-20250514',
                    max_tokens: 1024,
                    messages: [{
                        role: 'user',
                        content: [
                            {
                                type: 'image',
                                source: {
                                    type: 'base64',
                                    media_type: 'image/jpeg',
                                    data: base64Data
                                }
                            },
                            {
                                type: 'text',
                                text: prompt
                            }
                        ]
                    }]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `API 오류: ${response.status}`);
            }

            const data = await response.json();
            return this.parseResponse(data);
        } catch (error) {
            console.error('[OCR] Error:', error);
            throw error;
        }
    },

    /**
     * API 응답 파싱
     */
    parseResponse(data) {
        const textContent = data.content?.find(c => c.type === 'text');
        if (!textContent) {
            throw new Error('응답에서 텍스트를 찾을 수 없습니다.');
        }

        // JSON 추출 (마크다운 코드 블록 제거)
        let jsonStr = textContent.text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        try {
            const result = JSON.parse(jsonStr);
            return this.normalizeResult(result);
        } catch (e) {
            console.error('[OCR] JSON parse error:', e);
            throw new Error('응답 파싱 오류');
        }
    },

    /**
     * 결과 정규화
     */
    normalizeResult(result) {
        return {
            patient: {
                name: result.patient?.name || null,
                ageMonths: result.patient?.age_months || null,
                weightKg: result.patient?.weight_kg || null
            },
            prescriptions: (result.prescriptions || []).map(p => ({
                drugName: p.drug_name || '',
                dose: parseFloat(p.dose) || 0,
                doseUnit: p.dose_unit || 'mL',
                frequency: parseInt(p.frequency) || 3,
                duration: p.duration || null
            })),
            hospital: result.hospital || null,
            doctor: result.doctor || null,
            date: result.date || null
        };
    }
};

/**
 * 수동 입력 모드 (OCR 없이)
 */
const ManualInput = {
    /**
     * 빈 처방 데이터 생성
     */
    createEmpty() {
        return {
            patient: {
                name: null,
                ageMonths: null,
                weightKg: null
            },
            prescriptions: [],
            hospital: null,
            doctor: null,
            date: new Date().toISOString().split('T')[0]
        };
    },

    /**
     * 처방 항목 추가
     */
    addPrescription(data) {
        data.prescriptions.push({
            drugName: '',
            dose: 0,
            doseUnit: 'mL',
            frequency: 3,
            duration: null
        });
        return data;
    }
};
