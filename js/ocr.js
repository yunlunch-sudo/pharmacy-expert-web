/**
 * 처방 검토 서비스 - 스킬 기반 단일 API 호출
 *
 * 변경 이력:
 * - 2026-01-30: 2단계 OCR → 스킬 기반 1단계로 전환
 */

const PrescriptionReviewService = {
    apiKey: '',
    systemPrompt: '',
    knowledge: '',
    drugList: '',

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
     * 시스템 프롬프트 로드
     */
    async loadSystemPrompt() {
        if (this.systemPrompt) return this.systemPrompt;

        try {
            const response = await fetch('prompts/prescription-review-system.md');
            this.systemPrompt = await response.text();
            console.log('[Review] 시스템 프롬프트 로드 완료');
            return this.systemPrompt;
        } catch (e) {
            console.error('[Review] 시스템 프롬프트 로드 실패:', e);
            return '';
        }
    },

    /**
     * Knowledge 로드 (압축본)
     */
    async loadKnowledge() {
        if (this.knowledge) return this.knowledge;

        try {
            const response = await fetch('assets/pharmacy-expert/knowledge-pediatric-dosage-compact.md');
            this.knowledge = await response.text();
            console.log('[Review] Knowledge 로드 완료');
            return this.knowledge;
        } catch (e) {
            console.error('[Review] Knowledge 로드 실패:', e);
            return '';
        }
    },

    /**
     * 약국 조제 약물 목록 로드
     */
    async loadDrugList() {
        if (this.drugList) return this.drugList;

        try {
            const response = await fetch('assets/pharmacy-expert/dispensed-drugs-list.md');
            this.drugList = await response.text();
            console.log('[Review] 약물 목록 로드 완료');
            return this.drugList;
        } catch (e) {
            console.error('[Review] 약물 목록 로드 실패:', e);
            return '';
        }
    },

    /**
     * 처방전 검토 (스킬 기반 단일 호출)
     * @param {string} imageBase64 - 처방전 이미지 (base64 데이터 URL)
     * @returns {object} - 검토 결과 { markdown, patient, prescriptions }
     */
    async reviewPrescription(imageBase64) {
        if (!this.apiKey) {
            throw new Error('API 키가 설정되지 않았습니다.');
        }

        // base64 데이터 URL에서 실제 데이터만 추출
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        // 시스템 프롬프트, Knowledge, 약물 목록 로드
        const [systemPrompt, knowledge, drugList] = await Promise.all([
            this.loadSystemPrompt(),
            this.loadKnowledge(),
            this.loadDrugList()
        ]);

        // 오늘 날짜 (나이 계산용)
        const today = new Date();
        const todayStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

        // 사용자 프롬프트 구성
        const userPrompt = `오늘 날짜: ${todayStr}

## Knowledge (소아 용량 기준)
${knowledge}

---

${drugList}

---

위 Knowledge와 약국 조제 약물 목록을 참조하여 처방전 이미지를 분석하고 검토 리포트를 작성하세요.
처방전의 약물명은 반드시 약국 조제 약물 목록과 매칭하여 정확한 이름으로 표시하세요.`;

        console.log('[Review] API 호출 시작...');

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: 'claude-opus-4-5-20250514',
                max_tokens: 2048,
                system: systemPrompt,
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
                            text: userPrompt
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
        console.log('[Review] API 호출 완료');

        return this.parseResponse(data);
    },

    /**
     * API 응답 파싱
     */
    parseResponse(data) {
        const textContent = data.content?.find(c => c.type === 'text');
        if (!textContent) {
            throw new Error('응답에서 텍스트를 찾을 수 없습니다.');
        }

        const markdown = textContent.text;

        // 환자 정보 추출 (테이블에서)
        const patient = this.extractPatientInfo(markdown);

        // 판정 요약 추출
        const summary = this.extractSummary(markdown);

        return {
            markdown,      // 전체 마크다운 (UI에 표시)
            patient,       // 환자 정보 { name, age, weight }
            summary        // 요약 { hasIssues, criticalCount, warningCount }
        };
    },

    /**
     * 마크다운에서 환자 정보 추출
     */
    extractPatientInfo(markdown) {
        const patient = { name: null, age: null, weight: null };

        // 이름 추출
        const nameMatch = markdown.match(/이름\s*\|\s*(.+)/);
        if (nameMatch) {
            patient.name = nameMatch[1].trim();
        }

        // 나이 추출
        const ageMatch = markdown.match(/나이\s*\|\s*(.+)/);
        if (ageMatch) {
            patient.age = ageMatch[1].trim();
        }

        // 체중 추출
        const weightMatch = markdown.match(/체중\s*\|\s*(\d+(?:\.\d+)?)\s*kg/i);
        if (weightMatch) {
            patient.weight = parseFloat(weightMatch[1]);
        }

        return patient;
    },

    /**
     * 마크다운에서 판정 요약 추출
     */
    extractSummary(markdown) {
        const summary = {
            hasIssues: false,
            criticalCount: 0,
            warningCount: 0
        };

        // 🚨 과다 카운트
        const criticalMatches = markdown.match(/🚨/g);
        summary.criticalCount = criticalMatches ? criticalMatches.length : 0;

        // ⚠️ 과소/주의 카운트
        const warningMatches = markdown.match(/⚠️/g);
        summary.warningCount = warningMatches ? warningMatches.length : 0;

        summary.hasIssues = summary.criticalCount > 0 || summary.warningCount > 0;

        return summary;
    }
};

// 기존 OCRService 호환성 유지 (점진적 마이그레이션)
const OCRService = {
    apiKey: '',

    setApiKey(key) {
        this.apiKey = key;
        PrescriptionReviewService.setApiKey(key);
    },

    loadApiKey() {
        this.apiKey = PrescriptionReviewService.loadApiKey();
        return this.apiKey;
    },

    // 기존 메서드는 새 서비스로 위임
    async extractPrescription(imageBase64) {
        return PrescriptionReviewService.reviewPrescription(imageBase64);
    },

    // 조제 약물 목록 로드 (기존 호환성)
    dispensedDrugs: [],
    async loadDispensedDrugs() {
        try {
            const response = await fetch('js/dispensed-drugs.json');
            this.dispensedDrugs = await response.json();
            console.log(`[OCR] 조제 약물 목록 로드: ${this.dispensedDrugs.length}개`);
        } catch (e) {
            console.error('[OCR] 조제 약물 목록 로드 실패:', e);
            this.dispensedDrugs = [];
        }
    }
};

/**
 * 수동 입력 모드 (OCR 없이) - 기존 호환성 유지
 */
const ManualInput = {
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
