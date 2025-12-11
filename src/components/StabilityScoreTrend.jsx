import { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import chainScoresData from '../data/chainScores.json';
import { calculateWeightedScore } from '../utils/calculateScore';

// 차트 색상 (최대 4개)
const CHART_COLORS = ['#f6465d', '#f3ba3a', '#0ecb81', '#9852ed'];

function StabilityScoreTrend({ selectedChains = [], weights = { activity: 33, volatility: 34, persistence: 33 }, selectedDate = null, onDateSelect = () => {} }) {
  const [timeUnit, setTimeUnit] = useState(1); // 1일, 3일, 7일, 14일, 30일
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [zoomTarget, setZoomTarget] = useState(null); // { timestamp, relativePosition }
  const [isDraggingSelector, setIsDraggingSelector] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);
  const [hasDragged, setHasDragged] = useState(false); // 실제로 드래그가 발생했는지 추적
  const [isZooming, setIsZooming] = useState(false); // 줌 중인지 추적
  const containerRef = useRef(null);
  const chartDataLengthRef = useRef(0);

  // 선택된 체인의 일별 점수 데이터 준비 (가중치 적용, 과거→최신 순서)
  const chartData = useMemo(() => {
    if (selectedChains.length === 0) return [];

    // 첫 번째 체인의 날짜를 기준으로 데이터 생성
    const firstChainId = selectedChains[0].id;
    const firstChainData = chainScoresData[firstChainId];
    
    if (!firstChainData || !firstChainData.dailyScores) return [];

    // timeUnit에 따라 데이터 샘플링
    const allDates = firstChainData.dailyScores;
    const sampledData = allDates.filter((_, index) => index % timeUnit === 0);

    const result = sampledData.map((dayData) => {
      const dataPoint = {
        date: dayData.date,
        timestamp: dayData.timestamp,
      };

      // 선택된 모든 체인의 점수 추가 (가중치 적용하여 재계산)
      selectedChains.forEach((chain) => {
        const chainData = chainScoresData[chain.id];
        if (chainData && chainData.dailyScores) {
          const matchingDay = chainData.dailyScores.find(
            d => d.timestamp === dayData.timestamp
          );
          if (matchingDay && matchingDay.metrics) {
            // 가중치 적용하여 점수 재계산
            dataPoint[chain.id] = calculateWeightedScore(matchingDay.metrics, weights);
          } else {
            dataPoint[chain.id] = null;
          }
        }
      });

      return dataPoint;
    });

    // 과거→최신 순서로 뒤집기 (왼쪽=과거, 오른쪽=최신)
    return result.reverse();
  }, [selectedChains, timeUnit, weights]);

  // chartData 길이를 ref에 저장
  useEffect(() => {
    chartDataLengthRef.current = chartData.length;
  }, [chartData.length]);

  // 차트 너비 추적 (resize 이벤트 감지)
  useEffect(() => {
    const updateChartWidth = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    updateChartWidth();
    
    // ResizeObserver를 사용하여 컨테이너 크기 변경 감지
    const resizeObserver = new ResizeObserver(updateChartWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateChartWidth);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateChartWidth);
    };
  }, []);

  // chartData나 startIndex가 변경될 때 차트 너비 재계산
  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(containerRef.current.offsetWidth);
    }
  }, [chartData, startIndex]);

  // 줌 타겟이 있을 때 해당 위치 기준으로 startIndex 조정 및 날짜 선택
  useEffect(() => {
    if (zoomTarget && chartData.length > 0) {
      // chartData에서 zoomTarget.timestamp에 가장 가까운 인덱스 찾기
      let targetIndex = -1;
      let minDiff = Infinity;
      
      chartData.forEach((d, i) => {
        const diff = Math.abs(d.timestamp - zoomTarget.timestamp);
        if (diff < minDiff) {
          minDiff = diff;
          targetIndex = i;
        }
      });
      
      if (targetIndex === -1) {
        targetIndex = chartData.length - 1;
      }
      
      // 해당 인덱스가 화면의 zoomTarget.relativePosition 위치에 오도록 startIndex 설정
      const maxIndex = Math.max(0, chartData.length - 13);
      const newStartIndex = Math.max(0, Math.min(maxIndex, targetIndex - zoomTarget.relativePosition));
      setStartIndex(newStartIndex);
      
      // 가장 가까운 날짜로 선택 업데이트
      if (chartData[targetIndex]?.date) {
        onDateSelect(chartData[targetIndex].date);
      }
      
      setZoomTarget(null);
    }
  }, [chartData, zoomTarget, onDateSelect]);
  
  // 초기 로드 시 최신 데이터 위치로 설정 및 초기 날짜 선택
  useEffect(() => {
    if (chartData.length > 0 && !zoomTarget) {
      setStartIndex(Math.max(0, chartData.length - 13));
      // 초기 날짜 선택 (최신 날짜)
      if (!selectedDate && chartData[chartData.length - 1]) {
        onDateSelect(chartData[chartData.length - 1].date);
      }
    }
  }, [selectedChains]);

  // 표시할 데이터 범위 (13개 데이터 포인트)
  const visibleData = useMemo(() => {
    const displayCount = 13;
    return chartData.slice(startIndex, startIndex + displayCount);
  }, [chartData, startIndex]);

  // 스크롤 줌 핸들러 (마우스 위치 기준)
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;

    // 데이터가 없으면 무시
    if (chartData.length === 0) return;

    // 마우스의 차트 내 상대 X 위치 계산
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const yAxisWidth = 30;
    const mouseX = e.clientX - rect.left - yAxisWidth;
    const chartWidth = rect.width - yAxisWidth;
    const relativeX = Math.max(0, Math.min(1, mouseX / chartWidth));
    
    // 현재 보이는 데이터 중 마우스가 가리키는 인덱스 (0~12)
    const visibleCount = Math.min(13, chartData.length);
    const mouseDataIndex = Math.min(Math.round(relativeX * (visibleCount - 1)), visibleCount - 1);
    
    // 전체 데이터에서의 실제 인덱스 (범위 체크)
    const actualIndex = Math.min(startIndex + mouseDataIndex, chartData.length - 1);
    
    // 해당 데이터의 timestamp 저장
    const targetTimestamp = chartData[actualIndex]?.timestamp;

    let newTimeUnit = timeUnit;

    if (delta > 0) {
      // 스크롤 다운: 확대 (단위 줄이기)
      if (timeUnit === 30) newTimeUnit = 14;
      else if (timeUnit === 14) newTimeUnit = 7;
      else if (timeUnit === 7) newTimeUnit = 3;
      else if (timeUnit === 3) newTimeUnit = 1;
    } else {
      // 스크롤 업: 축소 (단위 늘리기)
      if (timeUnit === 1) newTimeUnit = 3;
      else if (timeUnit === 3) newTimeUnit = 7;
      else if (timeUnit === 7) newTimeUnit = 14;
      else if (timeUnit === 14) newTimeUnit = 30;
    }

    if (newTimeUnit !== timeUnit) {
      // 줌 시작 표시
      setIsZooming(true);
      
      // 줌 타겟 저장 후 timeUnit 변경
      if (targetTimestamp) {
        setZoomTarget({ timestamp: targetTimestamp, relativePosition: mouseDataIndex });
      }
      setTimeUnit(newTimeUnit);
      
      // 줌 완료 후 isZooming 해제 (chartData 업데이트 후)
      setTimeout(() => setIsZooming(false), 100);
    }
  };

  // 드래그 시작
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
    setHasDragged(false); // 드래그 시작 시 초기화
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
    // hasDragged는 클릭 이벤트 후에 초기화되도록 setTimeout 사용
    setTimeout(() => setHasDragged(false), 0);
  };

  // 드래그 중 (실시간 업데이트 - 그래프와 함께 이동)
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const diff = e.clientX - dragStart;
      const sensitivity = 0.075; // 절반으로 감도 낮춤
      const indexDiff = Math.round(diff * sensitivity);

      if (Math.abs(indexDiff) > 0) {
        setHasDragged(true); // 실제로 드래그가 발생했음을 표시
        const maxIndex = Math.max(0, chartDataLengthRef.current - 13);
        setStartIndex(prev => {
          // 오른쪽으로 드래그(diff > 0) → 과거를 당겨옴 (startIndex 감소, 더 앞쪽 데이터)
          // 왼쪽으로 드래그(diff < 0) → 최신으로 이동 (startIndex 증가, 더 뒤쪽 데이터)
          const newIndex = prev - indexDiff;
          return Math.max(0, Math.min(maxIndex, newIndex));
        });
        setDragStart(e.clientX);
      }
    };

    const handleMouseUpGlobal = () => {
      setIsDragging(false);
      // hasDragged는 클릭 이벤트 후에 초기화되도록 setTimeout 사용
      setTimeout(() => setHasDragged(false), 0);
    };

    // 실시간 업데이트를 위해 document에 리스너 추가
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUpGlobal);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, dragStart]);

  // 날짜 포맷 함수 (December 6th, 2025 형식)
  const formatTooltipDate = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // 서수 접미사 (1st, 2nd, 3rd, 4th...)
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' 
                 : (day === 2 || day === 22) ? 'nd' 
                 : (day === 3 || day === 23) ? 'rd' : 'th';
    
    return `${month} ${day}${suffix}, ${year}`;
  };

  // 선택된 날짜의 인덱스 찾기
  const selectedDateIndex = useMemo(() => {
    if (!selectedDate || visibleData.length === 0) return -1;
    return visibleData.findIndex(d => d.date === selectedDate);
  }, [selectedDate, visibleData]);

  // 차트 클릭 핸들러 (날짜 선택)
  const handleChartClick = (e) => {
    // 드래그 중이거나 드래그가 발생했다면 클릭 무시
    if (isDragging || isDraggingSelector || hasDragged) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const yAxisWidth = 30;
    const mouseX = e.clientX - rect.left - yAxisWidth;
    const chartWidth = rect.width - yAxisWidth;
    const relativeX = Math.max(0, Math.min(1, mouseX / chartWidth));
    
    const visibleCount = Math.min(13, visibleData.length);
    const clickedIndex = Math.min(Math.round(relativeX * (visibleCount - 1)), visibleCount - 1);
    
    if (clickedIndex >= 0 && clickedIndex < visibleData.length) {
      onDateSelect(visibleData[clickedIndex].date);
    }
  };

  // 날짜 선택기 드래그 시작
  const handleSelectorMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingSelector(true);
    setDragStart(e.clientX);
  };

  // 날짜 선택기 드래그
  useEffect(() => {
    if (!isDraggingSelector) return;

    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const yAxisWidth = 30;
      const mouseX = e.clientX - rect.left - yAxisWidth;
      const chartWidth = rect.width - yAxisWidth;
      const relativeX = Math.max(0, Math.min(1, mouseX / chartWidth));
      
      const visibleCount = Math.min(13, visibleData.length);
      const newIndex = Math.min(Math.round(relativeX * (visibleCount - 1)), visibleCount - 1);
      
      if (newIndex >= 0 && newIndex < visibleData.length) {
        onDateSelect(visibleData[newIndex].date);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSelector(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSelector, visibleData, onDateSelect]);

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-[#17191f] border border-[#222631] rounded-[20px] p-[20px]"
          style={{ marginLeft: '21px' }}
        >
          {/* 날짜 제목 */}
          <p className="text-[15px] text-[#a1a9c0] mb-[10px]">
            {formatTooltipDate(label)}
          </p>
          
          {/* 체인 항목들 */}
          <div className="flex flex-col gap-[10px]">
            {payload.map((entry, index) => {
              const chain = selectedChains.find(c => c.id === entry.dataKey);
              return (
                <div key={index} className="flex items-center gap-[10px]">
                  {/* 컬러 점 */}
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  {/* 체인 이름 */}
                  <span className="text-[15px] font-bold text-[#a1a9c0] w-[125px] truncate">
                    {chain?.name || entry.dataKey}
                  </span>
                  {/* 점수 */}
                  <span className="text-[15px] text-white">
                    {Math.round(entry.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#13151a] rounded-[20px] py-[30px] px-[40px] flex-[756] min-w-0">
      {/* Title */}
      <h2 className="text-[20px] font-bold text-white mb-[20px]">
        Stability Score Trend
      </h2>
      
      {/* Divider */}
      <hr className="border-t border-[#222631] mb-[23px]" />

      {/* Chart */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onClick={handleChartClick}
        className="relative cursor-grab active:cursor-grabbing"
        style={{ userSelect: 'none' }}
      >
        {selectedChains.length === 0 ? (
          <div className="h-[392px] flex items-center justify-center text-text-tertiary">
            Select chains to view stability trends
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={392}>
              <LineChart data={visibleData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                {/* Y축 점선 그리드 */}
                <ReferenceLine y={20} stroke="#2f374c" strokeDasharray="3 3" />
                <ReferenceLine y={40} stroke="#2f374c" strokeDasharray="3 3" />
                <ReferenceLine y={60} stroke="#2f374c" strokeDasharray="3 3" />
                <ReferenceLine y={80} stroke="#2f374c" strokeDasharray="3 3" />
                <ReferenceLine y={100} stroke="#2f374c" strokeDasharray="3 3" />
                
                {/* 0점 실선 */}
                <ReferenceLine y={0} stroke="#2f374c" strokeWidth={1} />
                
                <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a1a9c0', fontSize: 12, dy: 8 }}
                height={36}
                tickFormatter={(value, index) => {
                  const currentDate = new Date(value);
                  const currentDay = currentDate.getDate();
                  const currentMonth = currentDate.getMonth() + 1;
                  
                  // 첫 번째 데이터이거나 달이 바뀐 경우
                  if (index === 0) {
                    return `${currentMonth}/${currentDay}`;
                  }
                  
                  // 이전 날짜 확인
                  if (index > 0 && visibleData[index - 1]) {
                    const prevDate = new Date(visibleData[index - 1].date);
                    const prevMonth = prevDate.getMonth() + 1;
                    
                    // 달이 바뀌었으면 월/일 표시
                    if (currentMonth !== prevMonth) {
                      return `${currentMonth}/${currentDay}`;
                    }
                  }
                  
                  // 달이 같으면 일만 표시
                  return `${currentDay}`;
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a1a9c0', fontSize: 12 }}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                width={30}
              />
              <Tooltip 
                content={<CustomTooltip />}
                offset={21}
                cursor={false}
              />
              {selectedChains.map((chain, index) => (
                <Line
                  key={chain.id}
                  type="linear"
                  dataKey={chain.id}
                  stroke={CHART_COLORS[index]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 5, 
                    fill: CHART_COLORS[index],
                    stroke: '#13151a',
                    strokeWidth: 2
                  }}
                  isAnimationActive={!isDragging && !hasDragged && !isZooming}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* 날짜 선택기 - 파란색 수직선 */}
          {selectedDateIndex >= 0 && chartWidth > 0 && (
            <>
              {/* 파란색 수직선 (Y축 범위보다 5px씩 더 길게) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${30 + ((selectedDateIndex / Math.max(1, visibleData.length - 1)) * (chartWidth - 30))}px`,
                  top: '5px',
                  height: '362px', // 차트 높이 392px - X축 36px + 위아래 5px씩 = 356px + 6px
                  width: '2px',
                  backgroundColor: '#455cdc',
                  transform: 'translateX(-50%)',
                  zIndex: 5
                }}
              />
              
              {/* 날짜 레이블 (선 위쪽에 배치) */}
              <div
                className="absolute cursor-pointer select-none"
                style={{
                  left: `${30 + ((selectedDateIndex / Math.max(1, visibleData.length - 1)) * (chartWidth - 30))}px`,
                  top: '-1px',
                  transform: 'translateX(-50%) translateY(-100%)',
                  zIndex: 10
                }}
                onMouseDown={handleSelectorMouseDown}
              >
                <div className="text-xs text-[#455cdc] font-normal">
                  {visibleData[selectedDateIndex]?.date.split('-').slice(1).join('/')}
                </div>
              </div>
            </>
          )}
        </>
        )}
      </div>

      {/* Chart Info */}
      <div className="mt-[6px]">
        {/* Chain Legend - Center Aligned */}
        <div className="flex gap-[15px] justify-center text-xs font-bold text-text-secondary">
          {selectedChains.map((chain, index) => (
            <div key={chain.id} className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: CHART_COLORS[index] }}
              />
              <span>{chain.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default StabilityScoreTrend;
