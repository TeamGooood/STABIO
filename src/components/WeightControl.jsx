import { useState, useRef, useEffect, useCallback } from 'react';

function WeightControl({ weights, onWeightsChange }) {
  // 핸들 위치 계산 (가중치로부터)
  const [handle1Position, setHandle1Position] = useState(weights.activity);
  const [handle2Position, setHandle2Position] = useState(weights.activity + weights.volatility);
  const [draggingHandle, setDraggingHandle] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const sliderRef = useRef(null);
  const handle1Ref = useRef(handle1Position);
  const handle2Ref = useRef(handle2Position);
  const inputRef = useRef(null);
  
  // 쓰로틀링용 ref
  const lastUpdateRef = useRef(0);
  const pendingUpdateRef = useRef(null);
  const THROTTLE_MS = 50; // 50ms 간격으로 업데이트 제한

  // props 변경 시 핸들 위치 동기화
  useEffect(() => {
    setHandle1Position(weights.activity);
    setHandle2Position(weights.activity + weights.volatility);
  }, [weights]);

  // Ref 동기화
  useEffect(() => {
    handle1Ref.current = handle1Position;
    handle2Ref.current = handle2Position;
  }, [handle1Position, handle2Position]);

  // 쓰로틀된 가중치 업데이트
  const throttledUpdateWeights = useCallback((h1, h2) => {
    const now = Date.now();
    const newWeights = {
      activity: Math.round(h1),
      volatility: Math.round(h2 - h1),
      persistence: Math.round(100 - h2)
    };

    // 마지막 업데이트로부터 충분한 시간이 지났으면 바로 업데이트
    if (now - lastUpdateRef.current >= THROTTLE_MS) {
      lastUpdateRef.current = now;
      onWeightsChange(newWeights);
    } else {
      // 아니면 pending 업데이트 예약
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
      }
      pendingUpdateRef.current = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        onWeightsChange(newWeights);
        pendingUpdateRef.current = null;
      }, THROTTLE_MS);
    }
  }, [onWeightsChange]);

  // cleanup
  useEffect(() => {
    return () => {
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
      }
    };
  }, []);

  const handleMouseDown = useCallback((handleNumber) => (e) => {
    e.preventDefault();
    setDraggingHandle(handleNumber);
  }, []);

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (draggingHandle === null) return;

    const handleMouseMove = (e) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      if (draggingHandle === 1) {
        const newPosition = Math.max(5, Math.min(handle2Ref.current - 5, percentage));
        setHandle1Position(newPosition);
        throttledUpdateWeights(newPosition, handle2Ref.current);
      } else if (draggingHandle === 2) {
        const newPosition = Math.max(handle1Ref.current + 5, Math.min(95, percentage));
        setHandle2Position(newPosition);
        throttledUpdateWeights(handle1Ref.current, newPosition);
      }
    };

    const handleMouseUp = () => {
      setDraggingHandle(null);
      // 드래그 종료 시 마지막 상태 확정
      const finalWeights = {
        activity: Math.round(handle1Ref.current),
        volatility: Math.round(handle2Ref.current - handle1Ref.current),
        persistence: Math.round(100 - handle2Ref.current)
      };
      onWeightsChange(finalWeights);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingHandle, throttledUpdateWeights, onWeightsChange]);

  // 입력 시작
  const handleStartEdit = useCallback((id, value) => {
    setEditingId(id);
    setInputValue(String(value));
    setTimeout(() => inputRef.current?.select(), 0);
  }, []);

  // 입력값 변경
  const handleInputChange = useCallback((e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(val);
  }, []);

  // 입력값 적용
  const applyInputValue = useCallback(() => {
    const newValue = Math.max(5, Math.min(90, parseInt(inputValue) || 0));
    let newH1 = handle1Ref.current;
    let newH2 = handle2Ref.current;
    
    if (editingId === 'activity') {
      const maxPos = handle2Ref.current - 5;
      newH1 = Math.min(newValue, maxPos);
      setHandle1Position(newH1);
    } else if (editingId === 'volatility') {
      newH2 = handle1Ref.current + newValue;
      newH2 = Math.max(handle1Ref.current + 5, Math.min(95, newH2));
      setHandle2Position(newH2);
    } else if (editingId === 'persistence') {
      newH2 = 100 - newValue;
      newH2 = Math.max(handle1Ref.current + 5, Math.min(95, newH2));
      setHandle2Position(newH2);
    }
    
    onWeightsChange({
      activity: Math.round(newH1),
      volatility: Math.round(newH2 - newH1),
      persistence: Math.round(100 - newH2)
    });
    setEditingId(null);
    setInputValue('');
  }, [editingId, inputValue, onWeightsChange]);

  // 입력 완료
  const handleInputBlur = useCallback(() => {
    applyInputValue();
  }, [applyInputValue]);

  // Enter 키 처리
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      applyInputValue();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setInputValue('');
    }
  }, [applyInputValue]);

  const weightItems = [
    {
      id: 'activity',
      label: 'Activity',
      value: weights.activity,
      color: '#f6465d',
      colorClass: 'bg-chart-activity'
    },
    {
      id: 'volatility',
      label: 'Market Volatility',
      value: weights.volatility,
      color: '#f3ba3a',
      colorClass: 'bg-chart-volatility'
    },
    {
      id: 'persistence',
      label: 'Sustainability',
      value: weights.persistence,
      color: '#0ecb81',
      colorClass: 'bg-chart-persistence'
    }
  ];

  return (
    <div>
      {/* Title */}
      <h2 className="text-base font-bold text-text-secondary mb-[15px] leading-[23px] flex items-start">
        WEIGHT CONTROL
      </h2>

      {/* Controller Slider */}
      <div className="mb-[15px] h-[35px] flex items-center justify-center">
        <div 
          ref={sliderRef}
          className="relative w-[392px] h-[10px] rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              #f6465d 0%, 
              #f6465d ${handle1Position}%, 
              #f3ba3a ${handle1Position}%, 
              #f3ba3a ${handle2Position}%, 
              #0ecb81 ${handle2Position}%, 
              #0ecb81 100%)`
          }}
        >
          {/* Handle 1 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full cursor-grab active:cursor-grabbing p-[4px]"
            style={{ 
              left: `${handle1Position}%`,
              background: 'linear-gradient(to right, #f6465d, #f3ba3a)',
              boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.25)'
            }}
            onMouseDown={handleMouseDown(1)}
          >
            <div className="w-full h-full rounded-full bg-white" />
          </div>

          {/* Handle 2 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full cursor-grab active:cursor-grabbing p-[4px]"
            style={{ 
              left: `${handle2Position}%`,
              background: 'linear-gradient(to right, #f3ba3a, #0ecb81)',
              boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.25)'
            }}
            onMouseDown={handleMouseDown(2)}
          >
            <div className="w-full h-full rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Weight Items */}
      <div className="space-y-[15px]">
        {weightItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between h-[18px]">
            {/* Left: Color dot + Label */}
            <div className="flex items-center gap-[18px]">
              <div 
                className={`w-[8px] h-[8px] rounded-full ${item.colorClass}`}
              />
              <span className="text-base font-medium text-text-primary">
                {item.label}
              </span>
            </div>

            {/* Right: Value */}
            {editingId === item.id ? (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="w-[40px] text-base font-medium text-text-primary bg-transparent outline-none text-right caret-white selection:bg-[#A1A9C0] selection:text-text-primary"
                autoFocus
              />
            ) : (
              <span 
                className="text-base font-medium text-text-primary cursor-text"
                onClick={() => handleStartEdit(item.id, item.value)}
              >
                {item.value}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeightControl;
