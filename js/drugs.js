// 약물 데이터베이스 (자동 생성)
// Generated from knowledge-pediatric-dosage.md

const DRUGS_DATA = {
  "version": "1.0.0",
  "generated_at": "2026-01-28T16:57:34.411059",
  "source": "knowledge-pediatric-dosage.md",
  "drug_count": 33,
  "drugs": [
    {
      "id": 1,
      "product_name": "타이레놀 시럽",
      "concentration": "160mg/5mL",
      "drug_class": "해열진통제",
      "generic_name": "Acetaminophen",
      "ingredient": "Acetaminophen 160mg/5mL",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "min_mg_per_kg": 10.0,
        "max_mg_per_kg": 15.0,
        "unit": "mg"
      },
      "max_single_dose": 15.0,
      "max_daily_dose": 75.0,
      "frequency": 5,
      "min_age_months": 2,
      "min_weight_kg": null,
      "contraindications": [
        "간 기능 장애",
        "Acetaminophen 과민반응"
      ],
      "warnings": [
        "다른 Acetaminophen 함유 제제와 중복 주의",
        "장기 복용 시 간 기능 모니터링"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antipyretic_analgesic",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 2,
      "product_name": "챔프 시럽",
      "concentration": "80mg/mL",
      "drug_class": "해열진통제",
      "generic_name": "Acetaminophen",
      "ingredient": "Acetaminophen 80mg/mL",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "min_mg_per_kg": 10.0,
        "max_mg_per_kg": 15.0,
        "unit": "mg"
      },
      "max_single_dose": 15.0,
      "max_daily_dose": 75.0,
      "frequency": 5,
      "min_age_months": 2,
      "min_weight_kg": null,
      "contraindications": [],
      "warnings": [],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antipyretic_analgesic",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 3,
      "product_name": "어린이타이레놀현탁액",
      "concentration": "32mg/mL",
      "drug_class": "해열진통제",
      "generic_name": "Acetaminophen (Micronized)",
      "ingredient": "Acetaminophen 32mg/mL (16g/500mL)",
      "dose_basis": "both",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": 75.0,
      "frequency": 5,
      "min_age_months": 4,
      "min_weight_kg": null,
      "contraindications": [
        "Acetaminophen 과민반응",
        "중증 간/신장/심장 기능 저하",
        "알코올 복용자"
      ],
      "warnings": [
        "다른 Acetaminophen 함유 제제와 중복 주의",
        "타이레놀 시럽, 챔프 시럽과 동일 성분 (농도만 다름)",
        "장기 복용 시 간 기능 모니터링"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antipyretic_analgesic",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 4,
      "product_name": "부루펜 시럽",
      "concentration": "40mg/mL",
      "drug_class": "해열진통제",
      "generic_name": "Ibuprofen",
      "ingredient": "Ibuprofen 40mg/mL",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "min_mg_per_kg": 5.0,
        "max_mg_per_kg": 10.0,
        "unit": "mg"
      },
      "max_single_dose": 10.0,
      "max_daily_dose": 40.0,
      "frequency": 4,
      "min_age_months": 6,
      "min_weight_kg": 5.0,
      "contraindications": [
        "NSAIDs 과민반응",
        "활동성 위장관 출혈",
        "중증 심부전",
        "탈수 상태"
      ],
      "warnings": [
        "공복 투여 피하기 (위장 장애)",
        "천식 환자 주의",
        "신기능 장애 시 용량 조절"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antipyretic_analgesic",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 5,
      "product_name": "어린이부루펜시럽",
      "concentration": "20mg/mL",
      "drug_class": "해열진통제",
      "generic_name": "Ibuprofen",
      "ingredient": "Ibuprofen 20mg/mL (20g/1000mL)",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 12,
      "min_weight_kg": null,
      "contraindications": [
        "NSAIDs 과민반응",
        "아스피린 천식 또는 병력",
        "위장관 궤양 또는 출혈 병력",
        "중증 심부전",
        "임신 말기 3개월"
      ],
      "warnings": [
        "공복 투여 피하기 (위장 장애 위험)",
        "천식 환자 주의 (기관지 경련 유발 가능)",
        "고령자 및 소모성 질환 환자는 투여 후 관찰 필요",
        "부루펜 시럽(40mg/mL)과 동일 성분 (농도만 다름)"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antipyretic_analgesic",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 6,
      "product_name": "레보투스시럽",
      "concentration": "6mg/mL",
      "drug_class": "진해거담제",
      "generic_name": "Levodropropizine",
      "ingredient": "Levodropropizine 6mg/mL (3g/500mL)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": 1.0,
      "frequency": 3,
      "min_age_months": 24,
      "min_weight_kg": 10.0,
      "contraindications": [
        "Levodropropizine 과민반응",
        "기관지 점액 분비 증가 환자",
        "점액섬모기능이상 환자",
        "중증 간장애",
        "임신 및 수유부"
      ],
      "warnings": [
        "드물게 졸음 유발 (운전·기계 조작 주의)",
        "고령자 및 중증 심부전·신장부전 환자 신중 투여",
        "알코올과 병용 시 작용 증대 가능",
        "인근 소아과 임상 용량 기준 적용"
      ],
      "insurance_code": null,
      "notes": "인근 소아과에서 체중 1kg당 1mL을 하루 총량으로 3회 분할 처방",
      "drug_class_code": "antitussive_expectorant",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 7,
      "product_name": "튜란트시럽",
      "concentration": "20mg/mL",
      "drug_class": "진해거담제",
      "generic_name": "Acetylcysteine",
      "ingredient": "Acetylcysteine 20mg/mL (10g/500mL)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": 1.0,
      "frequency": 3,
      "min_age_months": 0,
      "min_weight_kg": null,
      "contraindications": [
        "Acetylcysteine 과민반응",
        "소화성 궤양 환자"
      ],
      "warnings": [
        "기관지 천식 환자 주의 (기관지 경련 유발 가능)",
        "위장장애 발생 가능 (오심, 구토)",
        "점액 용해 효과로 인한 객담 증가",
        "충분한 수분 섭취 권장"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 1kg당 1mL을 하루 총량으로 3회 분할 처방",
      "drug_class_code": "antitussive_expectorant",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 8,
      "product_name": "암브로콜시럽",
      "concentration": null,
      "drug_class": "진해거담제",
      "generic_name": "Ambroxol Hydrochloride",
      "ingredient": "Ambroxol",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": 1.0,
      "frequency": 3,
      "min_age_months": 24,
      "min_weight_kg": null,
      "contraindications": [
        "Ambroxol 과민반응",
        "위궤양 환자"
      ],
      "warnings": [
        "식후 복용 권장 (위장장애 예방)",
        "충분한 수분 섭취 권장 (거담 효과 증진)",
        "드물게 피부 발진, 두드러기 발생 가능",
        "장기 투여 시 의사 상담"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 1kg당 1mL을 하루 총량으로 3회 분할 처방",
      "drug_class_code": "antitussive_expectorant",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 9,
      "product_name": "엔디멜라정",
      "concentration": "비급여",
      "drug_class": "소염효소제",
      "generic_name": "Bromelain + Trypsin",
      "ingredient": "브로멜라인 + 트립신 (소염효소 복합제)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": null,
      "min_weight_kg": null,
      "contraindications": [
        "Bromelain 또는 Trypsin 과민반응",
        "출혈성 질환 (혈액응고 장애)"
      ],
      "warnings": [
        "파인애플 알레르기 환자 주의 (브로멜라인은 파인애플 유래)",
        "항응고제 복용 환자 주의",
        "드물게 위장장애 발생 가능"
      ],
      "insurance_code": "073200040",
      "notes": "제임스 약국에서 체중 ÷ 30을 1회 용량으로 하루 3회 처방 (레보드롭정 방식)",
      "drug_class_code": "anti_inflammatory_enzyme",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 10,
      "product_name": "슈다페드정",
      "concentration": "60mg/정",
      "drug_class": "비충혈제거제",
      "generic_name": "Pseudoephedrine Hydrochloride",
      "ingredient": "Pseudoephedrine 60mg/정",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 0,
      "min_weight_kg": null,
      "contraindications": [
        "Pseudoephedrine 과민반응",
        "MAO 억제제 복용 중인 환자",
        "중증 고혈압, 관상동맥질환",
        "협우각성 녹내장"
      ],
      "warnings": [
        "불면, 흥분 유발 가능 → 취침 전 복용 피하기",
        "심계항진, 두통 발생 가능",
        "고혈압, 심장질환, 갑상선기능항진증 환자 주의",
        "다른 교감신경흥분제와 병용 주의"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 기준 절반 용량 적용, 2세 미만에게도 처방",
      "drug_class_code": "decongestant",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 11,
      "product_name": "코미시럽",
      "concentration": null,
      "drug_class": "복합감기약",
      "generic_name": "Chlorpheniramine Maleate + Phenylephrine Hydrochloride",
      "ingredient": "항히스타민제 + 비충혈제거제 복합",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": 1.0,
      "frequency": 3,
      "min_age_months": 24,
      "min_weight_kg": null,
      "contraindications": [
        "약물 성분 과민반응",
        "중증 고혈압 또는 관상동맥질환",
        "협우각성 녹내장",
        "요저류",
        "소화성 궤양",
        "천식, 폐기종, 만성폐질환"
      ],
      "warnings": [
        "졸음 유발 가능 (운전·기계 조작 금지)",
        "알코올 섭취 금지",
        "어린이에서 흥분 발생 가능",
        "구갈, 두통 등 부작용 가능",
        "복합제이므로 다른 감기약과 중복 투여 주의",
        "항히스타민제 + 비충혈제거제 포함"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 1kg당 1mL을 하루 총량으로 3회 분할 처방",
      "drug_class_code": "cold_combination",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 12,
      "product_name": "포리부틴드라이시럽",
      "concentration": null,
      "drug_class": "위장관운동조절제",
      "generic_name": "Trimebutine Maleate",
      "ingredient": "Trimebutine",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": 1.0,
      "frequency": 3,
      "min_age_months": null,
      "min_weight_kg": null,
      "contraindications": [
        "Trimebutine 과민반응"
      ],
      "warnings": [
        "드물게 설사, 변비 등 위장 증상 발생 가능",
        "드물게 피부 발진, 두드러기 발생 가능",
        "졸음 유발 가능 (운전·기계 조작 주의)"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 1kg당 1mL을 하루 총량으로 3회 분할 처방",
      "drug_class_code": "gi_motility",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 13,
      "product_name": "아모크라네오시럽",
      "concentration": "14:1 복합제",
      "drug_class": "항생제",
      "generic_name": "Amoxicillin + Clavulanate Potassium (14:1)",
      "ingredient": "Amoxicillin/Clavulanate 복합항생제 (14:1 비율)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 3.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 3,
      "min_weight_kg": null,
      "contraindications": [
        "Penicillin 계열 과민반응",
        "Clavulanate 과민반응",
        "전염성 단핵구증",
        "중증 간 기능 장애"
      ],
      "warnings": [
        "식사 초기에 복용 (위장장애 예방)",
        "설사 발생 가능 (probiotics 고려)",
        "급성중이염: 10일간 투여",
        "급성부비동염: 7일간 투여",
        "피부 발진 발생 시 즉시 중단",
        "장기 투여 시 간/신장/혈액 기능 모니터링",
        "14:1 비율은 중이염 특화"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 ÷ 3을 1회 용량으로 하루 2회 (증상 심하면 3회) 처방",
      "drug_class_code": "antibiotic",
      "alert_under_ratio": null,
      "alert_over_ratio": 1.5
    },
    {
      "id": 14,
      "product_name": "오구멘틴듀오시럽",
      "concentration": "7:1 복합제",
      "drug_class": "항생제",
      "generic_name": "Amoxicillin + Clavulanate Potassium (7:1)",
      "ingredient": "Amoxicillin/Clavulanate 복합항생제 (7:1 비율)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 3,
      "min_weight_kg": null,
      "contraindications": [
        "Penicillin 계열 과민반응",
        "Clavulanate 과민반응",
        "전염성 단핵구증",
        "중증 간 기능 장애"
      ],
      "warnings": [
        "식사 초기에 복용 (위장장애 예방)",
        "설사 발생 가능 (probiotics 고려)",
        "피부 발진 발생 시 즉시 중단",
        "장기 투여 시 간/신장/혈액 기능 모니터링",
        "7:1 비율은 일반 감염에 사용"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 1kg당 1mL을 하루 총량으로 3회 분할 처방",
      "drug_class_code": "antibiotic",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 15,
      "product_name": "보령듀리세프건조시럽",
      "concentration": "250mg/5mL",
      "drug_class": "항생제",
      "generic_name": "Cefadroxil Hydrate",
      "ingredient": "세파드록실수화물 250mg/5mL (7.5g/150mL)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 3.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 2,
      "min_age_months": 3,
      "min_weight_kg": null,
      "contraindications": [
        "Cephalosporin 계열 과민반응",
        "Penicillin 계열 심한 과민반응 병력 (교차반응 주의)"
      ],
      "warnings": [
        "설사 발생 가능 (probiotics 고려)",
        "피부 발진 발생 시 즉시 중단",
        "신기능 장애 시 용량 조절 필요",
        "장기 투여 시 신장/혈액 기능 모니터링"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 ÷ 3을 1회 용량으로 하루 2회 처방",
      "drug_class_code": "antibiotic",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 16,
      "product_name": "세포독심건조시럽",
      "concentration": "10mg/mL",
      "drug_class": "항생제",
      "generic_name": "Cefpodoxime Proxetil",
      "ingredient": "세프포독심프록세틸 10mg/mL (2g/200mL)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 3.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 3,
      "min_weight_kg": null,
      "contraindications": [
        "Cephalosporin 계열 과민반응",
        "Penicillin 계열 심한 과민반응 병력 (교차반응 주의)"
      ],
      "warnings": [
        "설사 발생 가능 (probiotics 고려)",
        "피부 발진 발생 시 즉시 중단",
        "신기능 장애 시 용량 조절 필요",
        "장기 투여 시 신장/혈액 기능 모니터링"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 ÷ 3을 1회 용량으로 하루 2회 또는 3회 처방",
      "drug_class_code": "antibiotic",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 17,
      "product_name": "씨잘액",
      "concentration": "0.5mg/mL",
      "drug_class": "항히스타민제",
      "generic_name": "Levocetirizine Hydrochloride",
      "ingredient": "Levocetirizine 0.5mg/mL",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 12,
      "min_weight_kg": null,
      "contraindications": [
        "Levocetirizine 또는 Cetirizine 과민반응",
        "1세 미만 (사용 경험 부족)",
        "중증 신부전 (eGFR <10)"
      ],
      "warnings": [
        "졸음 유발 가능",
        "신기능 장애 시 용량 및 투여 간격 조절 필요",
        "Cetirizine의 활성 거울상 이성질체 (더 강력한 효과)"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antihistamine",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 18,
      "product_name": "대원케토티펜시럽",
      "concentration": "0.276mg/mL",
      "drug_class": "항알레르기제 (비만세포 안정화제)",
      "generic_name": "Ketotifen Fumarate",
      "ingredient": "Ketotifen 0.138g/500mL (케토티펜으로서 0.276mg/mL)",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 2,
      "min_age_months": 6,
      "min_weight_kg": null,
      "contraindications": [
        "Ketotifen 과민반응",
        "간질 등 경련성 질환 환자",
        "경구용 혈당강하제 투여 환자",
        "과당 불내성 환자",
        "수유부"
      ],
      "warnings": [
        "투여 초기 진정, 구갈, 어지러움 발생 가능 (지속 투여 시 자연 소실)",
        "기계 조작, 운전 시 주의",
        "중단 시 2-4주에 걸쳐 서서히 감량",
        "장기 투여 약물 (예방 목적)"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antiallergic",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 19,
      "product_name": "보령에바스텔내복액",
      "concentration": "1mg/mL",
      "drug_class": "항알레르기제 (비만세포 안정화제)",
      "generic_name": "Ebastine",
      "ingredient": "Ebastine 1mg/mL",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 1,
      "min_age_months": 24,
      "min_weight_kg": null,
      "contraindications": [
        "Ebastine 과민반응"
      ],
      "warnings": [
        "졸음 유발 가능",
        "간기능 장애 시 주의"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antiallergic",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 20,
      "product_name": "아스날린패취",
      "concentration": null,
      "drug_class": "기관지확장제",
      "generic_name": "Tulobuterol",
      "ingredient": "Tulobuterol 경피흡수제",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 6,
      "min_weight_kg": null,
      "contraindications": [
        "Tulobuterol 과민반응",
        "심한 갑상선기능항진증"
      ],
      "warnings": [
        "부착 부위를 매일 바꿔가며 사용",
        "피부 자극 시 부착 부위 변경",
        "심계항진, 손떨림 발생 가능"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "bronchodilator",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 21,
      "product_name": "싱귤레어",
      "concentration": null,
      "drug_class": "류코트리엔 수용체 길항제",
      "generic_name": "Montelukast Sodium",
      "ingredient": "Montelukast",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 1,
      "min_age_months": 12,
      "min_weight_kg": null,
      "contraindications": [
        "Montelukast 과민반응"
      ],
      "warnings": [
        "급성 천식 발작 치료 목적으로 사용 불가 (예방 목적)",
        "드물게 신경정신과적 이상반응 (기분 변화, 불면, 악몽 등)",
        "아스피린 과민성 환자도 아스피린/NSAIDs 회피 지속"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "leukotriene_antagonist",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 22,
      "product_name": "뮤테란과립",
      "concentration": "200mg/포",
      "drug_class": "거담제",
      "generic_name": "Acetylcysteine",
      "ingredient": "Acetylcysteine 200mg/포",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 30.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 0,
      "min_weight_kg": null,
      "contraindications": [
        "Acetylcysteine 과민반응",
        "기관지천식 (드물게 기관지경련 유발)"
      ],
      "warnings": [
        "충분한 수분 섭취 병행",
        "가래가 묽어지므로 기침이 일시적으로 증가할 수 있음",
        "위장장애 발생 가능 (오심, 구토)"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "expectorant",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 23,
      "product_name": "브로반시럽",
      "concentration": null,
      "drug_class": "거담제 (생약제제)",
      "generic_name": "Ivy Leaf Dry Extract (아이비엽건조엑스)",
      "ingredient": "아이비엽건조엑스",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 2,
      "min_age_months": 24,
      "min_weight_kg": null,
      "contraindications": [
        "아이비엽 추출물 과민반응",
        "과당 불내성 환자"
      ],
      "warnings": [
        "드물게 위장장애 발생 가능 (오심, 구토, 설사)",
        "드물게 알레르기 반응 발생 가능"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "expectorant",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 24,
      "product_name": "한미플루시럽",
      "concentration": "6mg/mL",
      "drug_class": "항바이러스제",
      "generic_name": "Oseltamivir Phosphate",
      "ingredient": "Oseltamivir 6mg/mL",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 2,
      "min_age_months": null,
      "min_weight_kg": null,
      "contraindications": [
        "Oseltamivir 과민반응"
      ],
      "warnings": [
        "증상 발현 48시간 이내 투여 시작 권장",
        "오심, 구토 발생 가능 (음식과 함께 복용)",
        "드물게 이상행동 보고 (청소년 주의 관찰)"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antiviral",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 25,
      "product_name": "한미플루캡슐",
      "concentration": null,
      "drug_class": "항바이러스제",
      "generic_name": "Oseltamivir Phosphate",
      "ingredient": "Oseltamivir 75mg/캡슐",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 2,
      "min_age_months": null,
      "min_weight_kg": null,
      "contraindications": [],
      "warnings": [],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antiviral",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 26,
      "product_name": "씨투스건조시럽",
      "concentration": null,
      "drug_class": "류코트리엔 수용체 길항제 (추가)",
      "generic_name": "Pranlukast Hydrate",
      "ingredient": "Pranlukast 70mg/g",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 2,
      "min_age_months": 12,
      "min_weight_kg": null,
      "contraindications": [
        "Pranlukast 과민반응"
      ],
      "warnings": [
        "급성 천식 발작 치료 목적으로 사용 불가 (예방 목적)",
        "간기능 검사 이상 발생 가능",
        "발진 등 과민반응 시 중단"
      ],
      "insurance_code": "",
      "notes": null,
      "drug_class_code": "leukotriene_antagonist",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 27,
      "product_name": "하이드라섹산",
      "concentration": "10mg/g, 30mg/g",
      "drug_class": "지사제",
      "generic_name": "Racecadotril",
      "ingredient": "Racecadotril",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": 6.0,
      "frequency": 3,
      "min_age_months": 3,
      "min_weight_kg": null,
      "contraindications": [
        "Racecadotril 과민반응",
        "과당 불내성",
        "혈변 또는 농양성 설사"
      ],
      "warnings": [
        "수분 및 전해질 보충 병행 필수",
        "항생제 관련 설사에는 사용 금지",
        "드물게 피부 발진 발생"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antidiarrheal",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 28,
      "product_name": "듀파락시럽",
      "concentration": "670mg/mL",
      "drug_class": "완하제",
      "generic_name": "Lactulose",
      "ingredient": "Lactulose 670mg/mL",
      "dose_basis": "age",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 0,
      "min_weight_kg": null,
      "contraindications": [
        "갈락토오즈혈증",
        "장폐색",
        "과당/갈락토오즈 불내성"
      ],
      "warnings": [
        "복부 팽만, 고창 발생 가능 (초기)",
        "당뇨병 환자 주의 (소량 당 함유)",
        "장기 사용 시 전해질 모니터링"
      ],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "laxative",
      "alert_under_ratio": 0.5,
      "alert_over_ratio": 1.0
    },
    {
      "id": 29,
      "product_name": "디푸루칸건조시럽",
      "concentration": "10mg/mL",
      "drug_class": "항진균제",
      "generic_name": "Fluconazole",
      "ingredient": "Fluconazole 10mg/mL (0.35g/35mL)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 3.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": null,
      "min_weight_kg": null,
      "contraindications": [
        "Fluconazole 과민반응",
        "Terfenadine, Cisapride 병용"
      ],
      "warnings": [
        "간기능 검사 이상 시 중단 고려",
        "약물 상호작용 다수 (Warfarin 등)",
        "QT 연장 유발 가능"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 ÷ 3을 1회 용량으로 하루 1회 처방",
      "drug_class_code": "antifungal",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 30,
      "product_name": "클래리건조시럽",
      "concentration": "125mg/5mL",
      "drug_class": "항생제 (추가)",
      "generic_name": "Clarithromycin",
      "ingredient": "Clarithromycin 125mg/5mL",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 3.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 2,
      "min_age_months": 6,
      "min_weight_kg": null,
      "contraindications": [
        "Macrolide 계열 과민반응",
        "Terfenadine, Cisapride, Pimozide 병용",
        "중증 간기능 장애"
      ],
      "warnings": [
        "위장장애 발생 가능 (오심, 구토, 설사)",
        "QT 연장 유발 가능",
        "약물 상호작용 다수"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 ÷ 3을 1회 용량으로 하루 2회 처방",
      "drug_class_code": "antibiotic",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 31,
      "product_name": "아지탑스건조시럽",
      "concentration": "40mg/mL",
      "drug_class": "항생제 (추가)",
      "generic_name": "Azithromycin Hydrate",
      "ingredient": "Azithromycin 40mg/mL",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 4.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": 6,
      "min_weight_kg": null,
      "contraindications": [
        "Macrolide 계열 과민반응",
        "중증 간기능 장애"
      ],
      "warnings": [
        "위장장애 발생 가능",
        "QT 연장 유발 가능",
        "식사와 무관하게 복용 가능"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 ÷ 4를 1회 용량으로 하루 1회 3일간 처방",
      "drug_class_code": "antibiotic",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 32,
      "product_name": "지나시드건조시럽",
      "concentration": "80mg/mL",
      "drug_class": "항생제 (추가)",
      "generic_name": "Acyclovir",
      "ingredient": "Acyclovir 80mg/mL (2.4g/30mL)",
      "dose_basis": "weight",
      "dose_formula": {
        "type": "weight_divided",
        "divisor": 4.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 4,
      "min_age_months": 24,
      "min_weight_kg": null,
      "contraindications": [
        "Acyclovir, Valacyclovir 과민반응"
      ],
      "warnings": [
        "충분한 수분 섭취 권장 (신기능 보호)",
        "신기능 장애 시 용량 조절",
        "증상 발현 초기 투여 시 효과적"
      ],
      "insurance_code": null,
      "notes": "제임스 약국에서 체중 ÷ 4를 1회 용량으로 하루 4회 처방",
      "drug_class_code": "antibiotic",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    },
    {
      "id": 33,
      "product_name": "제품명",
      "concentration": "농도",
      "drug_class": "항생제 (추가)",
      "generic_name": "",
      "ingredient": "",
      "dose_basis": "both",
      "dose_formula": {
        "type": "weight_based",
        "daily_per_kg": 1.0,
        "unit": "mL"
      },
      "max_single_dose": null,
      "max_daily_dose": null,
      "frequency": 3,
      "min_age_months": null,
      "min_weight_kg": null,
      "contraindications": [],
      "warnings": [],
      "insurance_code": null,
      "notes": null,
      "drug_class_code": "antibiotic",
      "alert_under_ratio": 0.0,
      "alert_over_ratio": 1.3
    }
  ]
};
