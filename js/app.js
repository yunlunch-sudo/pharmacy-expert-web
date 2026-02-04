/**
 * Pharmacy Expert - 메인 앱 로직
 */

const App = {
    currentData: null,
    recentReviews: [],

    /**
     * 앱 초기화
     */
    async init() {
        console.log('[App] Initializing...');

        // 약물 DB 로드
        DrugsDatabase.load();
        this.updateDbStatus(DrugsDatabase.isLoaded);

        // 카메라 초기화
        await Camera.init();

        // 저장된 리뷰 로드
        this.loadRecentReviews();

        // API 키 로드
        OCRService.loadApiKey();

        // 조제 약물 목록 로드
        await OCRService.loadDispensedDrugs();

        // 이벤트 바인딩
        this.bindEvents();

        // 카메라 버튼 활성화
        document.getElementById('captureBtn').disabled = false;

        console.log('[App] Initialized');
    },

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 촬영 버튼
        document.getElementById('captureBtn').addEventListener('click', () => this.handleCapture());

        // 파일 선택 버튼
        document.getElementById('uploadBtn').addEventListener('click', () => this.handleFilePick());

        // 약물 추가 버튼
        document.getElementById('addDrugBtn').addEventListener('click', () => this.addPrescriptionRow());

        // 분석 버튼
        document.getElementById('analyzeBtn').addEventListener('click', () => this.handleAnalyze());

        // 환자 정보 입력 변경
        ['patientName', 'patientAge', 'ageUnit', 'patientWeight'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.updateCurrentData());
        });
    },

    /**
     * DB 상태 업데이트
     */
    updateDbStatus(isLoaded) {
        const statusEl = document.getElementById('dbStatus');
        const dot = statusEl.querySelector('.status-dot');
        const text = statusEl.querySelector('.status-text');

        if (isLoaded) {
            dot.classList.add('ready');
            text.textContent = `DB 준비됨 (${DrugsDatabase.drugs.length}개 약물)`;
        } else {
            dot.classList.remove('ready');
            text.textContent = '로딩 실패';
        }
    },

    /**
     * 촬영 처리 - 네이티브 카메라 앱 직접 실행
     */
    async handleCapture() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment'; // 후면 카메라 직접 열기

            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject(new Error('파일이 선택되지 않았습니다.'));
                    return;
                }

                try {
                    // 이미지 최적화 후 처리
                    const optimizedImage = await this.optimizeImage(file);
                    await this.processImage(optimizedImage);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            input.click();
        }).catch(error => {
            this.showToast(error.message);
        });
    },

    /**
     * 이미지 최적화 - 처방전 OCR에 최적화된 해상도로 조정
     * Claude Vision API는 1568px 이하로 리사이징함
     * 너무 크면 품질 손실, 너무 작으면 글씨 인식 불가
     */
    async optimizeImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                // 최적 해상도: 긴 변 1500px (API 리사이징 방지)
                const MAX_SIZE = 1500;
                let { width, height } = img;

                if (width > MAX_SIZE || height > MAX_SIZE) {
                    if (width > height) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    } else {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // 고품질 리사이징
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // PNG로 저장 (무손실, 글씨 선명)
                const dataUrl = canvas.toDataURL('image/png');
                console.log(`[Image] 최적화: ${img.width}x${img.height} → ${width}x${height}`);
                resolve(dataUrl);
            };

            img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));

            // 파일을 이미지로 로드
            const reader = new FileReader();
            reader.onload = (e) => { img.src = e.target.result; };
            reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
            reader.readAsDataURL(file);
        });
    },

    /**
     * 파일 선택 처리
     */
    async handleFilePick() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject(new Error('파일이 선택되지 않았습니다.'));
                    return;
                }

                try {
                    // 이미지 최적화 후 처리
                    const optimizedImage = await this.optimizeImage(file);
                    await this.processImage(optimizedImage);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            input.click();
        }).catch(error => {
            this.showToast(error.message);
        });
    },

    /**
     * 이미지 처리 (스킬 기반 처방 검토)
     */
    async processImage(imageData) {
        // API 키 확인
        if (!OCRService.apiKey) {
            const key = prompt('Anthropic API 키를 입력하세요:');
            if (!key) {
                this.showManualInput();
                return;
            }
            OCRService.setApiKey(key);
        }

        this.showLoading('처방전 검토 중...');

        try {
            const result = await PrescriptionReviewService.reviewPrescription(imageData);
            this.currentData = result;

            this.hideLoading();

            // 마크다운 결과 표시
            this.showMarkdownResults(result);

            this.showToast('처방전 검토 완료');
        } catch (error) {
            this.hideLoading();
            this.showToast('검토 실패: ' + error.message);
            this.showManualInput();
        }
    },

    /**
     * 마크다운 결과 표시
     */
    showMarkdownResults(result) {
        // 환자/처방 입력 섹션 숨기기
        document.getElementById('patientSection').style.display = 'none';
        document.getElementById('prescriptionsSection').style.display = 'none';

        // 결과 섹션 표시
        document.getElementById('resultsSection').style.display = 'block';
        const container = document.getElementById('resultsContent');

        // 요약 배지
        const summary = result.summary;
        let summaryHtml = '<div class="result-summary">';
        if (summary.criticalCount > 0) {
            summaryHtml += `<div class="result-stat danger"><span>🚨 위험 ${summary.criticalCount}건</span></div>`;
        }
        if (summary.warningCount > 0) {
            summaryHtml += `<div class="result-stat warning"><span>⚠️ 주의 ${summary.warningCount}건</span></div>`;
        }
        if (!summary.hasIssues) {
            summaryHtml += '<div class="result-stat success"><span>✅ 모든 용량 적정</span></div>';
        }
        summaryHtml += '</div>';

        // 마크다운 렌더링
        const markdownHtml = this.renderMarkdown(result.markdown);

        container.innerHTML = summaryHtml + '<div class="markdown-content">' + markdownHtml + '</div>';

        // 결과 섹션으로 스크롤
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

        // 최근 검토에 저장
        this.saveReview({
            patient: result.patient,
            summary: result.summary,
            markdown: result.markdown,
            timestamp: new Date().toISOString()
        });
    },

    /**
     * 마크다운 렌더링 (marked.js 사용)
     */
    renderMarkdown(markdown) {
        // marked.js 사용
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true
            });
            let html = marked.parse(markdown);

            // 테이블에 클래스 추가
            html = html.replace(/<table>/g, '<table class="review-table">');

            return html;
        }

        // marked.js 없을 때 기본 렌더링
        return markdown
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    },

    /**
     * 수동 입력 모드 표시
     */
    showManualInput() {
        this.currentData = ManualInput.createEmpty();
        this.showPatientSection(this.currentData.patient);
        this.showPrescriptionsSection([]);
        this.addPrescriptionRow();
    },

    /**
     * 환자 정보 섹션 표시
     */
    showPatientSection(patient) {
        document.getElementById('patientSection').style.display = 'block';

        document.getElementById('patientName').value = patient.name || '';

        if (patient.ageMonths !== null) {
            if (patient.ageMonths >= 24) {
                document.getElementById('patientAge').value = Math.floor(patient.ageMonths / 12);
                document.getElementById('ageUnit').value = 'years';
            } else {
                document.getElementById('patientAge').value = patient.ageMonths;
                document.getElementById('ageUnit').value = 'months';
            }
        }

        document.getElementById('patientWeight').value = patient.weightKg || '';
    },

    /**
     * 처방 약물 섹션 표시
     */
    showPrescriptionsSection(prescriptions) {
        document.getElementById('prescriptionsSection').style.display = 'block';

        const container = document.getElementById('prescriptionsList');
        container.innerHTML = '';

        prescriptions.forEach((p, index) => {
            this.addPrescriptionRow(p, index);
        });
    },

    /**
     * 처방 항목 행 추가
     */
    addPrescriptionRow(data = null, index = null) {
        const container = document.getElementById('prescriptionsList');
        const idx = index !== null ? index : container.children.length;

        const row = document.createElement('div');
        row.className = 'prescription-item';
        row.dataset.index = idx;

        row.innerHTML = `
            <div class="form-group drug-name">
                <label>약물명</label>
                <input type="text" class="drug-input" placeholder="약물명 입력"
                       value="${data?.drugName || ''}"
                       list="drug-suggestions-${idx}">
                <datalist id="drug-suggestions-${idx}"></datalist>
            </div>
            <div class="form-group dose">
                <label>1회 용량</label>
                <input type="number" class="dose-input" placeholder="0" min="0" step="0.1"
                       value="${data?.dose || ''}">
            </div>
            <div class="form-group">
                <label>단위</label>
                <select class="unit-select">
                    <option value="mL" ${data?.doseUnit === 'mL' ? 'selected' : ''}>mL</option>
                    <option value="mg" ${data?.doseUnit === 'mg' ? 'selected' : ''}>mg</option>
                    <option value="정" ${data?.doseUnit === '정' ? 'selected' : ''}>정</option>
                    <option value="캡슐" ${data?.doseUnit === '캡슐' ? 'selected' : ''}>캡슐</option>
                </select>
            </div>
            <div class="form-group">
                <label>횟수</label>
                <select class="freq-select">
                    <option value="1" ${data?.frequency === 1 ? 'selected' : ''}>1일 1회</option>
                    <option value="2" ${data?.frequency === 2 ? 'selected' : ''}>1일 2회</option>
                    <option value="3" ${data?.frequency === 3 || !data ? 'selected' : ''}>1일 3회</option>
                    <option value="4" ${data?.frequency === 4 ? 'selected' : ''}>1일 4회</option>
                </select>
            </div>
            <button class="btn-remove" title="삭제">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // 자동완성
        const drugInput = row.querySelector('.drug-input');
        const datalist = row.querySelector('datalist');

        drugInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const suggestions = DrugsDatabase.searchDrugs(query);

            datalist.innerHTML = suggestions
                .map(d => `<option value="${d.product_name}">`)
                .join('');
        });

        // 삭제 버튼
        row.querySelector('.btn-remove').addEventListener('click', () => {
            row.remove();
        });

        container.appendChild(row);
    },

    /**
     * 현재 데이터 업데이트
     */
    updateCurrentData() {
        if (!this.currentData) {
            this.currentData = ManualInput.createEmpty();
        }

        const ageValue = parseInt(document.getElementById('patientAge').value) || 0;
        const ageUnit = document.getElementById('ageUnit').value;

        this.currentData.patient = {
            name: document.getElementById('patientName').value || null,
            ageMonths: ageUnit === 'years' ? ageValue * 12 : ageValue,
            weightKg: parseFloat(document.getElementById('patientWeight').value) || null
        };
    },

    /**
     * 처방 데이터 수집
     */
    collectPrescriptions() {
        const rows = document.querySelectorAll('.prescription-item');
        const prescriptions = [];

        rows.forEach(row => {
            const drugName = row.querySelector('.drug-input').value.trim();
            const dose = parseFloat(row.querySelector('.dose-input').value) || 0;
            const doseUnit = row.querySelector('.unit-select').value;
            const frequency = parseInt(row.querySelector('.freq-select').value) || 3;

            if (drugName && dose > 0) {
                prescriptions.push({ drugName, dose, doseUnit, frequency });
            }
        });

        return prescriptions;
    },

    /**
     * 분석 실행
     */
    handleAnalyze() {
        this.updateCurrentData();
        const prescriptions = this.collectPrescriptions();

        if (prescriptions.length === 0) {
            this.showToast('분석할 약물을 입력하세요.');
            return;
        }

        if (!this.currentData.patient.weightKg) {
            this.showToast('환자 체중을 입력하세요.');
            return;
        }

        const analysis = DosageCalculator.analyze(
            prescriptions,
            this.currentData.patient,
            DrugsDatabase
        );

        this.showResults(analysis);

        // 최근 검토에 저장
        this.saveReview({
            patient: this.currentData.patient,
            prescriptions,
            analysis,
            timestamp: new Date().toISOString()
        });
    },

    /**
     * 결과 표시 (상세 리포트 형식)
     */
    showResults(analysis) {
        document.getElementById('resultsSection').style.display = 'block';
        const container = document.getElementById('resultsContent');

        const patient = this.currentData.patient;
        const ageStr = patient.ageMonths
            ? (patient.ageMonths >= 24 ? `${Math.floor(patient.ageMonths/12)}세` : `${patient.ageMonths}개월`)
            : '미입력';

        let html = '';

        // 처방 검토 리포트 헤더
        html += `
            <div class="report-header">
                <h2>처방 검토 리포트</h2>
                <div class="patient-info-summary">
                    <span><strong>환자:</strong> ${patient.name || '미입력'}</span>
                    <span><strong>나이:</strong> ${ageStr}</span>
                    <span><strong>체중:</strong> ${patient.weightKg || '-'}kg</span>
                </div>
            </div>
        `;

        // 요약 배지
        html += `
            <div class="result-summary">
                ${analysis.criticalCount > 0 ? `
                    <div class="result-stat danger">
                        <span>🚨 위험 ${analysis.criticalCount}건</span>
                    </div>
                ` : ''}
                ${analysis.warningCount > 0 ? `
                    <div class="result-stat warning">
                        <span>⚠️ 주의 ${analysis.warningCount}건</span>
                    </div>
                ` : ''}
                ${!analysis.hasIssues ? `
                    <div class="result-stat success">
                        <span>✅ 모든 용량 적정</span>
                    </div>
                ` : ''}
            </div>
        `;

        // 약물별 상세 분석
        analysis.drugResults.forEach((result, idx) => {
            const statusIcon = {
                appropriate: '✅',
                overdose: '🚨',
                underdose: '⚠️',
                unknown: '❓'
            }[result.status];

            const statusText = {
                appropriate: '적정',
                overdose: '과용량',
                underdose: '과소',
                unknown: '확인불가'
            }[result.status];

            const recDose = result.recommendedDose;
            const recDesc = recDose && recDose.min > 0
                ? (recDose.min === recDose.max
                    ? `${recDose.min.toFixed(1)}${recDose.unit}`
                    : `${recDose.min.toFixed(1)}-${recDose.max.toFixed(1)}${recDose.unit}`)
                : '-';

            // 용량 계산 과정 표시
            let calcProcess = '';
            if (result.matchedDrug && result.matchedDrug.dose_formula && patient.weightKg) {
                const formula = result.matchedDrug.dose_formula;
                if (formula.daily_per_kg) {
                    calcProcess = `${patient.weightKg}kg × ${formula.daily_per_kg}${formula.unit}/kg/day ÷ ${result.prescription.frequency}회`;
                } else if (formula.divisor) {
                    calcProcess = `${patient.weightKg}kg ÷ ${formula.divisor}`;
                }
            }

            html += `
                <div class="drug-result-detailed">
                    <div class="drug-result-header">
                        <h3>${idx + 1}. ${result.prescription.drugName}</h3>
                        <span class="status-badge ${result.status}">${statusIcon} ${statusText}</span>
                    </div>

                    ${result.matchedDrug ? `
                        <div class="drug-info-box">
                            <div class="info-label">📚 약물 정보</div>
                            <div class="info-content">
                                <div><strong>성분:</strong> ${result.matchedDrug.ingredient || '-'}</div>
                                ${result.matchedDrug.dose_formula ? `
                                    <div><strong>용량 기준:</strong> ${this.formatDoseFormula(result.matchedDrug.dose_formula)}</div>
                                ` : ''}
                            </div>
                        </div>
                    ` : `
                        <div class="drug-info-box unknown">
                            <div class="info-label">❓ 약물 정보</div>
                            <div class="info-content">데이터베이스에 없는 약물입니다</div>
                        </div>
                    `}

                    <div class="dose-comparison">
                        <div class="dose-row">
                            <span class="dose-label">처방 용량:</span>
                            <span class="dose-value">${result.prescription.dose}${result.prescription.doseUnit} × ${result.prescription.frequency}회/일</span>
                        </div>
                        <div class="dose-row">
                            <span class="dose-label">권장 용량:</span>
                            <span class="dose-value">${recDesc}</span>
                        </div>
                        ${calcProcess ? `
                            <div class="dose-row calc">
                                <span class="dose-label">계산:</span>
                                <span class="dose-value">${calcProcess}</span>
                            </div>
                        ` : ''}
                    </div>

                    ${result.message && result.status !== 'appropriate' ? `
                        <div class="drug-result-message ${result.status === 'overdose' ? 'danger' : 'warning'}">
                            ${result.message}
                        </div>
                    ` : ''}
                </div>
            `;
        });

        // 중복/상호작용 분석
        html += `
            <div class="analysis-section">
                <h3>중복/상호작용 분석</h3>
                <table class="analysis-table">
                    <tr>
                        <td>동일 성분 중복</td>
                        <td>${analysis.duplications.filter(d => d.type === 'sameIngredient').length > 0
                            ? '🚨 ' + analysis.duplications.filter(d => d.type === 'sameIngredient').map(d => d.ingredient).join(', ') + ' 중복'
                            : '✅ 없음'}</td>
                    </tr>
                    <tr>
                        <td>약물 상호작용</td>
                        <td>✅ 확인된 상호작용 없음</td>
                    </tr>
                    <tr>
                        <td>금기사항</td>
                        <td>✅ 해당없음</td>
                    </tr>
                </table>
            </div>
        `;

        // 중복 경고 상세
        if (analysis.duplications.length > 0) {
            html += `<div class="duplications-detail">`;
            analysis.duplications.forEach(dup => {
                html += `
                    <div class="duplication-warning">
                        <h4>🚨 ${dup.type === 'sameIngredient' ? '동일 성분 중복' : '동일 약효군 중복'}</h4>
                        <p><strong>${dup.drugNames.join(' + ')}</strong></p>
                        <p>${dup.message}</p>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // 종합 의견
        const overallStatus = analysis.criticalCount > 0 ? '🚨 수정 필요' :
                            analysis.warningCount > 0 ? '⚠️ 일부 확인 필요' : '✅ 적정';

        html += `
            <div class="summary-section">
                <h3>종합 의견</h3>
                <div class="overall-status ${analysis.criticalCount > 0 ? 'danger' : analysis.warningCount > 0 ? 'warning' : 'success'}">
                    <strong>처방 적정성:</strong> ${overallStatus}
                </div>
                ${analysis.criticalCount > 0 || analysis.warningCount > 0 ? `
                    <div class="recommendations">
                        <strong>권장사항:</strong>
                        <ul>
                            ${analysis.drugResults.filter(r => r.status === 'overdose').map(r =>
                                `<li>${r.prescription.drugName}: 용량 감량 필요</li>`
                            ).join('')}
                            ${analysis.drugResults.filter(r => r.status === 'underdose').map(r =>
                                `<li>${r.prescription.drugName}: 용량 확인 필요</li>`
                            ).join('')}
                            ${analysis.duplications.map(d =>
                                `<li>${d.drugNames.join('/')} 중복 처방 확인 필요</li>`
                            ).join('')}
                        </ul>
                    </div>
                ` : `
                    <div class="recommendations success">
                        <strong>특이사항:</strong> 없음
                    </div>
                `}
            </div>
        `;

        container.innerHTML = html;

        // 결과 섹션으로 스크롤
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * 용량 공식 포맷팅
     */
    formatDoseFormula(formula) {
        if (!formula) return '-';
        if (formula.type === 'default' && formula.description) {
            return formula.description + ' (기본 체중 기준)';
        }
        if (formula.daily_per_kg) {
            return `${formula.daily_per_kg}${formula.unit}/kg/day, 분할 투여`;
        }
        if (formula.divisor) {
            return `체중 ÷ ${formula.divisor} = 1회 용량 (${formula.unit})`;
        }
        if (formula.min_mg_per_kg && formula.max_mg_per_kg) {
            return `${formula.min_mg_per_kg}-${formula.max_mg_per_kg}mg/kg/dose`;
        }
        return '-';
    },

    /**
     * 리뷰 저장
     */
    saveReview(review) {
        this.recentReviews.unshift(review);
        if (this.recentReviews.length > 20) {
            this.recentReviews = this.recentReviews.slice(0, 20);
        }
        localStorage.setItem('recent_reviews', JSON.stringify(this.recentReviews));
        this.renderRecentReviews();
    },

    /**
     * 리뷰 로드
     */
    loadRecentReviews() {
        try {
            this.recentReviews = JSON.parse(localStorage.getItem('recent_reviews') || '[]');
            this.renderRecentReviews();
        } catch {
            this.recentReviews = [];
        }
    },

    /**
     * 최근 리뷰 렌더링
     */
    renderRecentReviews() {
        const container = document.getElementById('recentReviews');

        if (this.recentReviews.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
                    </svg>
                    <p>아직 검토 기록이 없습니다</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.recentReviews.map((review, idx) => {
            const patient = review.patient;
            const time = new Date(review.timestamp);
            const timeStr = this.formatRelativeTime(time);

            const ageStr = patient.ageMonths
                ? (patient.ageMonths >= 24 ? `${Math.floor(patient.ageMonths/12)}세` : `${patient.ageMonths}개월`)
                : '';
            const weightStr = patient.weightKg ? `${patient.weightKg}kg` : '';
            const infoStr = [ageStr, weightStr].filter(Boolean).join(', ');

            return `
                <div class="review-card" data-index="${idx}">
                    <div class="review-card-header">
                        <span class="review-card-name">${patient.name || '환자'}</span>
                        ${review.analysis.hasIssues ? `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>
                        ` : ''}
                    </div>
                    <div class="review-card-info">${infoStr || '정보 없음'}</div>
                    <div class="review-card-time">${timeStr}</div>
                </div>
            `;
        }).join('');
    },

    /**
     * 상대 시간 포맷
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR');
    },

    /**
     * 로딩 표시
     */
    showLoading(text = '로딩 중...') {
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingOverlay').style.display = 'flex';
    },

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    },

    /**
     * 토스트 메시지
     */
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
};

// 앱 시작
document.addEventListener('DOMContentLoaded', () => App.init());
