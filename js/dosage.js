/**
 * 용량 계산 및 처방 검증 모듈
 */

const DosageCalculator = {
    /**
     * 체중 기준 1회 용량 계산
     */
    calculateSingleDose(formula, weightKg, frequency) {
        if (!formula || !weightKg || weightKg <= 0) {
            return { min: 0, max: 0, unit: formula?.unit || 'mL' };
        }

        const type = formula.type;
        const unit = formula.unit || 'mL';

        if (type === 'weight_based') {
            if (formula.daily_per_kg) {
                // mL/kg/day를 frequency로 나눔
                const dailyTotal = weightKg * formula.daily_per_kg;
                const single = dailyTotal / frequency;
                return { min: single, max: single, unit };
            } else if (formula.min_mg_per_kg && formula.max_mg_per_kg) {
                // mg/kg/dose 범위
                return {
                    min: weightKg * formula.min_mg_per_kg,
                    max: weightKg * formula.max_mg_per_kg,
                    unit
                };
            }
        } else if (type === 'weight_divided') {
            if (formula.divisor) {
                // 체중 ÷ divisor = 1회 용량
                const single = weightKg / formula.divisor;
                return { min: single, max: single, unit };
            }
        }

        return { min: 0, max: 0, unit };
    },

    /**
     * 기본 용량 상태 평가 (DB 미등록 약물)
     * 허용 범위: 권장 용량의 50% ~ 150%
     */
    evaluateDefaultDosage(prescribedDose, recommendedDose) {
        const avg = (recommendedDose.min + recommendedDose.max) / 2;
        if (avg <= 0) return 'unknown';

        const ratio = prescribedDose / avg;

        if (ratio > 1.5) return 'overdose';
        if (ratio < 0.5) return 'underdose';
        return 'appropriate';
    },

    /**
     * 용량 상태 평가
     */
    evaluateDosage(prescribedDose, recommendedDose, drug) {
        const avgRecommended = (recommendedDose.min + recommendedDose.max) / 2;

        if (avgRecommended <= 0) {
            return 'unknown';
        }

        const ratio = prescribedDose / avgRecommended;

        // 과다 용량 체크
        const overRatio = drug.alert_over_ratio;
        if (overRatio !== null && overRatio !== undefined) {
            if (ratio > overRatio) {
                return 'overdose';
            }
        } else {
            if (ratio > 1.0) {
                return 'overdose';
            }
        }

        // 과소 용량 체크
        const underRatio = drug.alert_under_ratio;
        if (underRatio !== null && underRatio !== undefined) {
            if (ratio < underRatio) {
                return 'underdose';
            }
        } else {
            if (ratio < 0.5) {
                return 'underdose';
            }
        }

        return 'appropriate';
    },

    /**
     * 데이터베이스에 없는 약물의 기본 용량 계산
     * - 정제/캡슐: 체중 ÷ 30 = 1회 용량 (하루 3회 기준)
     * - 시럽/액제: 체중 ÷ 3 = 1회 용량 mL (하루 3회 기준, 1mL/kg/day)
     */
    calculateDefaultDose(prescription, patient) {
        const weightKg = patient.weightKg;
        const unit = prescription.doseUnit;
        const frequency = prescription.frequency || 3;

        if (unit === '정' || unit === '캡슐' || unit === '정(캡슐)') {
            // 정제/캡슐: 체중 ÷ 30 × 3 = 일일 총량, 1회 = 체중 ÷ 30
            const singleDose = weightKg / 30;
            return {
                min: singleDose,
                max: singleDose,
                unit: unit,
                formula: `체중 ÷ 30 = ${singleDose.toFixed(2)}${unit}/회`
            };
        } else if (unit === 'mL' || unit === 'ml') {
            // 시럽: 1mL/kg/day ÷ frequency = 1회 용량
            const dailyTotal = weightKg * 1; // 1mL/kg/day
            const singleDose = dailyTotal / frequency;
            return {
                min: singleDose,
                max: singleDose,
                unit: 'mL',
                formula: `${weightKg}kg × 1mL/kg/day ÷ ${frequency}회 = ${singleDose.toFixed(2)}mL/회`
            };
        }

        return null;
    },

    /**
     * 개별 약물 분석
     */
    analyzeDrug(prescription, patient, drugsDb) {
        const drug = drugsDb.findDrug(prescription.drugName);

        // 데이터베이스에 없는 약물: 기본 용량 규칙 적용
        if (!drug) {
            if (!patient.weightKg || patient.weightKg <= 0) {
                return {
                    prescription,
                    matchedDrug: null,
                    status: 'unknown',
                    recommendedDose: null,
                    message: '환자 체중 정보가 필요합니다'
                };
            }

            const defaultDose = this.calculateDefaultDose(prescription, patient);
            if (defaultDose) {
                const status = this.evaluateDefaultDosage(prescription.dose, defaultDose);
                return {
                    prescription,
                    matchedDrug: {
                        product_name: prescription.drugName,
                        ingredient: '(DB 미등록)',
                        dose_formula: {
                            type: 'default',
                            description: defaultDose.formula
                        }
                    },
                    status,
                    recommendedDose: defaultDose,
                    message: status === 'appropriate'
                        ? '기본 체중 기준 적정'
                        : `기본 체중 기준 ${status === 'overdose' ? '초과' : '미달'} (권장: ${defaultDose.min.toFixed(2)}${defaultDose.unit})`
                };
            }

            return {
                prescription,
                matchedDrug: null,
                status: 'unknown',
                recommendedDose: null,
                message: '용량 확인 불가 (단위 미지원)'
            };
        }

        if (!patient.weightKg || patient.weightKg <= 0) {
            return {
                prescription,
                matchedDrug: drug,
                status: 'unknown',
                recommendedDose: null,
                message: '환자 체중 정보가 필요합니다'
            };
        }

        const recommendedDose = this.calculateSingleDose(
            drug.dose_formula,
            patient.weightKg,
            prescription.frequency
        );

        const status = this.evaluateDosage(prescription.dose, recommendedDose, drug);

        const message = this.generateMessage(status, prescription.dose, recommendedDose);

        return {
            prescription,
            matchedDrug: drug,
            status,
            recommendedDose,
            message
        };
    },

    /**
     * 결과 메시지 생성
     */
    generateMessage(status, prescribedDose, recommendedDose) {
        const avg = (recommendedDose.min + recommendedDose.max) / 2;
        const recDesc = recommendedDose.min === recommendedDose.max
            ? `${recommendedDose.min.toFixed(1)}${recommendedDose.unit}`
            : `${recommendedDose.min.toFixed(1)}-${recommendedDose.max.toFixed(1)}${recommendedDose.unit}`;

        switch (status) {
            case 'appropriate':
                return '적정 용량입니다';
            case 'overdose':
                const overPercent = Math.round((prescribedDose / avg - 1) * 100);
                return `권장 용량 대비 ${overPercent}% 초과 (권장: ${recDesc})`;
            case 'underdose':
                const underPercent = Math.round((1 - prescribedDose / avg) * 100);
                return `권장 용량 대비 ${underPercent}% 부족 (권장: ${recDesc})`;
            default:
                return '용량 확인 불가';
        }
    },

    /**
     * 중복 처방 검출
     */
    checkDuplications(prescriptions, drugsDb) {
        const warnings = [];
        const ingredientMap = {};

        // 성분별 그룹화
        prescriptions.forEach(p => {
            const drug = drugsDb.findDrug(p.drugName);
            if (drug && drug.ingredient) {
                const key = drug.ingredient.toLowerCase().replace(/\s/g, '');
                if (!ingredientMap[key]) {
                    ingredientMap[key] = [];
                }
                ingredientMap[key].push({ prescription: p, drug });
            }
        });

        // 중복 검사
        for (const [ingredient, items] of Object.entries(ingredientMap)) {
            if (items.length > 1) {
                const drugNames = items.map(i => i.drug.product_name);
                const drugClass = items[0].drug.drug_class_code;

                // 해열제 교차 투여는 허용 (단, 동일 성분은 경고)
                if (drugClass === 'antipyretic_analgesic') {
                    const uniqueIngredients = new Set(items.map(i => i.drug.ingredient));
                    if (uniqueIngredients.size === 1) {
                        warnings.push({
                            type: 'sameIngredient',
                            drugNames,
                            ingredient: items[0].drug.ingredient,
                            severity: 'critical',
                            message: `동일 성분(${items[0].drug.ingredient}) 중복 처방 - 일일 최대 용량 초과 위험`
                        });
                    }
                } else {
                    warnings.push({
                        type: 'sameIngredient',
                        drugNames,
                        ingredient: items[0].drug.ingredient,
                        severity: 'critical',
                        message: `동일 성분(${items[0].drug.ingredient}) 중복 처방`
                    });
                }
            }
        }

        return warnings;
    },

    /**
     * 전체 처방 분석
     */
    analyze(prescriptions, patient, drugsDb) {
        const drugResults = prescriptions.map(p =>
            this.analyzeDrug(p, patient, drugsDb)
        );

        const duplications = this.checkDuplications(prescriptions, drugsDb);

        return {
            drugResults,
            duplications,
            hasIssues: drugResults.some(r => r.status !== 'appropriate') || duplications.length > 0,
            criticalCount: drugResults.filter(r => r.status === 'overdose').length +
                          duplications.filter(d => d.severity === 'critical').length,
            warningCount: drugResults.filter(r => r.status === 'underdose').length +
                         duplications.filter(d => d.severity === 'warning').length
        };
    }
};

/**
 * 약물 데이터베이스 래퍼
 */
const DrugsDatabase = {
    drugs: [],
    isLoaded: false,

    load() {
        if (typeof DRUGS_DATA !== 'undefined') {
            this.drugs = DRUGS_DATA.drugs || [];
            this.isLoaded = true;
            console.log(`[DrugsDB] Loaded ${this.drugs.length} drugs`);
        }
    },

    findDrug(name) {
        if (!name) return null;

        const normalized = name.toLowerCase().replace(/\s/g, '');

        // 정확히 일치
        let found = this.drugs.find(d =>
            d.product_name.toLowerCase().replace(/\s/g, '') === normalized
        );

        if (found) return found;

        // 부분 일치
        found = this.drugs.find(d => {
            const drugNorm = d.product_name.toLowerCase().replace(/\s/g, '');
            return drugNorm.includes(normalized) || normalized.includes(drugNorm);
        });

        return found || null;
    },

    searchDrugs(query) {
        if (!query || query.length < 2) return [];

        const normalized = query.toLowerCase();
        return this.drugs.filter(d =>
            d.product_name.toLowerCase().includes(normalized) ||
            (d.generic_name && d.generic_name.toLowerCase().includes(normalized))
        ).slice(0, 10);
    }
};
