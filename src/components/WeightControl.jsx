import { useState, useRef, useEffect } from 'react';

function WeightControl() {
  // 핸들 위치 (0-100 범위, 첫 번째 핸들은 Activity/Volatility 경계, 두 번째는 Volatility/Persistence 경계)
  const [handle1Position, setHandle1Position] = useState(30); // Activity 끝 = 30%
  const [handle2Position, setHandle2Position] = useState(70); // Volatility 끝 = 70% (Activity 30% + Volatility 40%)
  const [draggingHandle, setDraggingHandle] = useState(null);
  const [editingId, setEditingId] = useState(null); // 현재 편집 중인 항목
  const [inputValue, setInputValue] = useState(''); // 입력 중인 값
  const sliderRef = useRef(null);
  const handle1Ref = useRef(handle1Position);
  const handle2Ref = useRef(handle2Position);
  const inputRef = useRef(null);

  // Ref 동기화
  useEffect(() => {
    handle1Ref.current = handle1Position;
    handle2Ref.current = handle2Position;
  }, [handle1Position, handle2Position]);

  // 가중치 계산
  const weights = {
    activity: Math.round(handle1Position),
    volatility: Math.round(handle2Position - handle1Position),
    persistence: Math.round(100 - handle2Position)
  };

  const handleMouseDown = (handleNumber) => (e) => {
    e.preventDefault();
    setDraggingHandle(handleNumber);
  };

  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    if (draggingHandle === null) return;

    const handleMouseMove = (e) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      if (draggingHandle === 1) {
        // 첫 번째 핸들: 0%와 두 번째 핸들 사이에서만 이동
        const newPosition = Math.max(5, Math.min(handle2Ref.current - 5, percentage));
        setHandle1Position(newPosition);
      } else if (draggingHandle === 2) {
        // 두 번째 핸들: 첫 번째 핸들과 100% 사이에서만 이동
        const newPosition = Math.max(handle1Ref.current + 5, Math.min(95, percentage));
        setHandle2Position(newPosition);
      }
    };

    const handleMouseUp = () => {
      setDraggingHandle(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingHandle]);

  // 입력 시작
  const handleStartEdit = (id, value) => {
    setEditingId(id);
    setInputValue(String(value));
    setTimeout(() => inputRef.current?.select(), 0);
  };

  // 입력값 변경
  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    setInputValue(val);
  };

  // 입력 완료
  const handleInputBlur = () => {
    applyInputValue();
  };

  // Enter 키 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyInputValue();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setInputValue('');
    }
  };

  // 입력값 적용
  const applyInputValue = () => {
    const newValue = Math.max(5, Math.min(90, parseInt(inputValue) || 0));
    
    if (editingId === 'activity') {
      // Activity 변경: handle1 위치 조정
      const maxPos = handle2Position - 5;
      setHandle1Position(Math.min(newValue, maxPos));
    } else if (editingId === 'volatility') {
      // Volatility 변경: handle2 위치 조정 (handle1 + volatility)
      const newHandle2 = handle1Position + newValue;
      setHandle2Position(Math.max(handle1Position + 5, Math.min(95, newHandle2)));
    } else if (editingId === 'persistence') {
      // Persistence 변경: handle2 위치 조정 (100 - persistence)
      const newHandle2 = 100 - newValue;
      setHandle2Position(Math.max(handle1Position + 5, Math.min(95, newHandle2)));
    }
    
    setEditingId(null);
    setInputValue('');
  };

  const weightItems = [
    {
      id: 'activity',
      label: 'Activity',
      value: weights.activity,
      color: '#f83464',
      colorClass: 'bg-chart-activity'
    },
    {
      id: 'volatility',
      label: 'Economic Volatility',
      value: weights.volatility,
      color: '#ff852f',
      colorClass: 'bg-chart-volatility'
    },
    {
      id: 'persistence',
      label: 'Persistence',
      value: weights.persistence,
      color: '#43d2a7',
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
              #f83464 0%, 
              #f83464 ${handle1Position}%, 
              #ff852f ${handle1Position}%, 
              #ff852f ${handle2Position}%, 
              #43d2a7 ${handle2Position}%, 
              #43d2a7 100%)`
          }}
        >
          {/* Handle 1 (Activity/Volatility 경계) - 부드러운 그라데이션 테두리 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full cursor-grab active:cursor-grabbing p-[4px]"
            style={{ 
              left: `${handle1Position}%`,
              background: 'linear-gradient(to right, #f83464, #ff852f)',
              boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.25)'
            }}
            onMouseDown={handleMouseDown(1)}
          >
            <div className="w-full h-full rounded-full bg-white" />
          </div>

          {/* Handle 2 (Volatility/Persistence 경계) - 부드러운 그라데이션 테두리 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full cursor-grab active:cursor-grabbing p-[4px]"
            style={{ 
              left: `${handle2Position}%`,
              background: 'linear-gradient(to right, #ff852f, #43d2a7)',
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

            {/* Right: Value (클릭하여 편집 가능) */}
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

