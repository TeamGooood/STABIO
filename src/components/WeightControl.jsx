import { useState, useRef, useEffect } from 'react';

function WeightControl() {
  // 핸들 위치 (0-100 범위, 첫 번째 핸들은 Activity/Volatility 경계, 두 번째는 Volatility/Persistence 경계)
  const [handle1Position, setHandle1Position] = useState(30); // Activity 끝 = 30%
  const [handle2Position, setHandle2Position] = useState(70); // Volatility 끝 = 70% (Activity 30% + Volatility 40%)
  const [draggingHandle, setDraggingHandle] = useState(null);
  const sliderRef = useRef(null);
  const handle1Ref = useRef(handle1Position);
  const handle2Ref = useRef(handle2Position);

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
      <h2 className="text-base font-bold text-text-secondary mb-[33px]">
        WEIGHT CONTROL
      </h2>

      {/* Controller Slider */}
      <div className="mb-[15px] h-[35px] flex items-center justify-center">
        <div 
          ref={sliderRef}
          className="relative w-[197px] h-[10px] rounded-full cursor-pointer"
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
              background: 'linear-gradient(to right, #f83464, #ff852f)'
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
              background: 'linear-gradient(to right, #ff852f, #43d2a7)'
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
            <span className="text-base font-medium text-text-primary">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeightControl;

