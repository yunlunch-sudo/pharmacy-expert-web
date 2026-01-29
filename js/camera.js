/**
 * 카메라 모듈 - 웹 카메라 접근 및 촬영
 */

const Camera = {
    video: null,
    canvas: null,
    stream: null,
    isActive: false,

    /**
     * 카메라 초기화
     */
    async init() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');

        if (!this.video || !this.canvas) {
            console.error('[Camera] Video or canvas element not found');
            return false;
        }

        return true;
    },

    /**
     * 카메라 시작
     */
    async start() {
        try {
            // 후면 카메라 우선 (모바일)
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;

            // 비디오 로드 대기
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });

            this.isActive = true;

            // UI 업데이트
            document.getElementById('cameraPlaceholder').style.display = 'none';
            document.getElementById('cameraGuide').style.display = 'flex';

            console.log('[Camera] Started successfully');
            return true;
        } catch (error) {
            console.error('[Camera] Error starting camera:', error);

            if (error.name === 'NotAllowedError') {
                throw new Error('카메라 접근이 거부되었습니다. 설정에서 카메라 권한을 허용해주세요.');
            } else if (error.name === 'NotFoundError') {
                throw new Error('카메라를 찾을 수 없습니다.');
            } else {
                throw new Error('카메라를 시작할 수 없습니다: ' + error.message);
            }
        }
    },

    /**
     * 카메라 중지
     */
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.video) {
            this.video.srcObject = null;
        }

        this.isActive = false;

        // UI 업데이트
        const placeholder = document.getElementById('cameraPlaceholder');
        const guide = document.getElementById('cameraGuide');
        if (placeholder) placeholder.style.display = 'flex';
        if (guide) guide.style.display = 'none';

        console.log('[Camera] Stopped');
    },

    /**
     * 사진 촬영
     */
    capture() {
        if (!this.isActive || !this.video || !this.canvas) {
            throw new Error('카메라가 활성화되지 않았습니다.');
        }

        // 캔버스 크기 설정
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // 이미지 그리기
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0);

        // Base64 이미지 반환
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);

        console.log('[Camera] Image captured');
        return imageData;
    },

    /**
     * 카메라 권한 확인
     */
    async checkPermission() {
        try {
            const result = await navigator.permissions.query({ name: 'camera' });
            return result.state; // 'granted', 'denied', 'prompt'
        } catch {
            // permissions API 지원 안 함
            return 'prompt';
        }
    },

    /**
     * 카메라 지원 확인
     */
    isSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
};

/**
 * 파일 선택으로 이미지 로드 (카메라 대안)
 */
const ImagePicker = {
    /**
     * 파일 선택 다이얼로그 열기
     */
    async pickImage() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment'; // 모바일에서 카메라 직접 열기

            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject(new Error('파일이 선택되지 않았습니다.'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    resolve(event.target.result);
                };
                reader.onerror = () => {
                    reject(new Error('파일을 읽을 수 없습니다.'));
                };
                reader.readAsDataURL(file);
            };

            input.click();
        });
    }
};
