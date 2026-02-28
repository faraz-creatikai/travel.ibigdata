"use client";

import { useState, useEffect, useRef } from "react";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getCustomer, getFilteredCustomer } from "@/store/customer";

// Types
interface User {
  id: number;
  name: string;
  customers: number;
}

interface UserData {
  users: User[];
}

// Custom ChevronDown icon
const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function RadarChart() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, value: 0 });
  const [dropdownDirection, setDropdownDirection] = useState<'bottom' | 'top'>('bottom');
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const { userCustomers, setUserCustomers } = useDashboardData();
  const [selectedUser, setSelectedUser] = useState(userCustomers.users[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("chart-container");
      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const width = Math.min(containerWidth, 800);
        const height = Math.min(containerHeight * 0.9, width * 0.75);
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const container = document.getElementById("chart-container");
    if (container) {
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(container);
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", updateDimensions);
      };
    }

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const calculateDropdownPosition = () => {
    if (!dropdownButtonRef.current) return 'bottom';
    const buttonRect = dropdownButtonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const estimatedDropdownHeight = 240;
    if (spaceBelow < estimatedDropdownHeight && spaceAbove >= estimatedDropdownHeight) {
      return 'top';
    }
    return 'bottom';
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      const direction = calculateDropdownPosition();
      setDropdownDirection(direction);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  useEffect(() => {
    setAnimatedSpeed(0);
    const targetSpeed = selectedUser?.customers || 0;
    const duration = 1500;
    const steps = 60;
    const increment = targetSpeed / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedSpeed(targetSpeed);
        clearInterval(timer);
      } else {
        setAnimatedSpeed(Math.round(increment * currentStep));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [selectedUser]);

  const getZoneColor = (speed: number): string => {
    if (speed <= 90) return "#4ade80";
    if (speed <= 210) return "#f59e0b";
    return "#f87171";
  };

  const getZoneLabel = (speed: number): string => {
    if (speed <= 90) return "Safe";
    if (speed <= 210) return "Normal";
    return "High";
  };

  const calculateNeedleAngle = (speed: number): number => {
    const normalizedSpeed = Math.min(Math.max(speed, 0), 300);
    return -135 + (normalizedSpeed / 300) * 270;
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ): { x: number; y: number } => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const createArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    innerRadius: number
  ): string => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const innerStart = polarToCartesian(x, y, innerRadius, endAngle);
    const innerEnd = polarToCartesian(x, y, innerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y} Z`;
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    setTooltip({ show: true, x: svgP.x, y: svgP.y, value: animatedSpeed });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, value: 0 });
    setHoveredZone(null);
  };

  const handleZoneHover = (zone: string) => { setHoveredZone(zone); };
  const handleZoneLeave = () => { setHoveredZone(null); };

  const centerX = dimensions.width / 2;
  const centerY = (dimensions.height - 80) / 2 + 20;
  const outerRadius = Math.min(centerX, centerY) * 0.8;
  const innerRadius = outerRadius * 0.6;
  const needleLength = outerRadius * 0.85;
  const needleAngle = calculateNeedleAngle(animatedSpeed);

  const getUsers = async () => {
    const response = await getCustomer();
    setCustomerCount(response.length);
    const users = response.filter((item: any) => {
      return item.AssignTo && item.AssignTo !== "";
    });
    return users;
  };

  const RedarChartDataFetch = async () => {
    try {
      const allCustomers = await getUsers();
      if (!allCustomers || allCustomers.length === 0) {
        setUserCustomers({ users: [] });
        return;
      }
      const userMap: Record<string, { id: string; name: string; customers: number }> = {};
      allCustomers.forEach((customer: any) => {
        const userName = customer.AssignTo?.name;
        const userId = customer.AssignTo?._id;
        if (!userName || !userId) return;
        if (!userMap[userId]) {
          userMap[userId] = { id: userId, name: userName, customers: 0 };
        }
        userMap[userId].customers += 1;
      });
      const customerLength = await getCustomer();
      const totalCustomers = customerLength.length;
      const result = Object.values(userMap).map(user => ({
        ...user,
        percentage: totalCustomers > 0 ? Math.round((user.customers / totalCustomers) * 100) : 0
      }));
      setUserCustomers({ users: result });
      setSelectedUser(result[0] || null);
    } catch (error) {
      console.error("Error fetching radar chart data:", error);
    }
  };

  useEffect(() => { RedarChartDataFetch(); }, []);

  // ─── Zone badge config ───────────────────────────────────────────────────────
  const zoneLabel = getZoneLabel(animatedSpeed);
  const zoneColor = getZoneColor(animatedSpeed);

  return (
    <div className="flex flex-col w-full h-auto min-h-[350px] font-mono">
      {/* Card */}
      <div
        className="
          relative w-full h-full flex flex-col
          bg-white dark:bg-[#0f1117]
          border border-gray-200 dark:border-white/10
          rounded-2xl 
          shadow-xl dark:shadow-[0_0_60px_rgba(0,0,0,0.6)]
          p-5 sm:p-7
        "
      >
        {/* Subtle grid overlay — dark only */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-4 shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-0.5">
              Distribution
            </p>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white leading-none">
              Customer Allocation
            </h2>
          </div>

          {/* Live zone pill */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide border"
            style={{
              color: zoneColor,
              borderColor: `${zoneColor}44`,
              backgroundColor: `${zoneColor}11`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: zoneColor }}
            />
            {zoneLabel}
          </span>
        </div>

        {/* Chart area */}
        <div id="chart-container" className="relative z-10 w-full flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="overflow-visible"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Glow filter for needle */}
                <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Drop shadow */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Zone glows */}
                <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>

                {/* Gauge arc gradients */}
                <radialGradient id="greenGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.85" />
                </radialGradient>
                <radialGradient id="amberGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fcd34d" stopOpacity="1" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
                </radialGradient>
                <radialGradient id="redGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f87171" stopOpacity="1" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.85" />
                </radialGradient>
              </defs>

              {/* Inner track ring */}
              <path
                d={createArc(centerX, centerY, innerRadius + 4, -135, 135, innerRadius - 4)}
                fill="none"
                stroke="rgba(100,100,120,0.15)"
                strokeWidth="1"
              />

              {/* Green zone */}
              <path
                d={createArc(centerX, centerY, outerRadius, -135, -45, innerRadius)}
                fill="url(#greenGrad)"
                opacity={hoveredZone === 'green' ? 1 : 0.75}
                filter={hoveredZone === 'green' ? "url(#greenGlow)" : undefined}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => handleZoneHover('green')}
                onMouseLeave={handleZoneLeave}
              />

              {/* Amber/Gray zone */}
              <path
                d={createArc(centerX, centerY, outerRadius, -45, 45, innerRadius)}
                fill="url(#amberGrad)"
                opacity={hoveredZone === 'gray' ? 1 : 0.75}
                filter={hoveredZone === 'gray' ? "url(#amberGlow)" : undefined}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => handleZoneHover('gray')}
                onMouseLeave={handleZoneLeave}
              />

              {/* Red zone */}
              <path
                d={createArc(centerX, centerY, outerRadius, 45, 135, innerRadius)}
                fill="url(#redGrad)"
                opacity={hoveredZone === 'red' ? 1 : 0.75}
                filter={hoveredZone === 'red' ? "url(#redGlow)" : undefined}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => handleZoneHover('red')}
                onMouseLeave={handleZoneLeave}
              />

              {/* Divider lines between zones */}
              {[-45, 45].map((angle) => {
                const inner = polarToCartesian(centerX, centerY, innerRadius - 2, angle);
                const outer = polarToCartesian(centerX, centerY, outerRadius + 2, angle);
                return (
                  <line
                    key={angle}
                    x1={inner.x} y1={inner.y}
                    x2={outer.x} y2={outer.y}
                    stroke="rgba(15,17,23,0.6)"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Scale ticks + labels */}
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => {
                const angle = -135 + (value / 300) * 810;
                const tickOuter = polarToCartesian(centerX, centerY, outerRadius + 10, angle);
                const tickInner = polarToCartesian(centerX, centerY, outerRadius + 4, angle);
                const labelPoint = polarToCartesian(centerX, centerY, outerRadius + 26, angle);
                const isMajor = value % 50 === 0;

                return (
                  <g key={value}>
                    <line
                      x1={tickInner.x} y1={tickInner.y}
                      x2={tickOuter.x} y2={tickOuter.y}
                      stroke={isMajor ? "rgba(150,150,170,0.8)" : "rgba(100,100,120,0.5)"}
                      strokeWidth={isMajor ? "2" : "1"}
                    />
                    <text
                      x={labelPoint.x}
                      y={labelPoint.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={isMajor ? "11" : "9"}
                      fontFamily="monospace"
                      fill={isMajor ? "rgba(200,200,220,0.9)" : "rgba(130,130,150,0.7)"}
                      fontWeight={isMajor ? "600" : "400"}
                    >
                      {value}%
                    </text>
                  </g>
                );
              })}

              {/* Zone labels inside arcs */}
              {[
                { label: "LOW", angle: -90, color: "#4ade80" },
                { label: "MID", angle: 0, color: "#fcd34d" },
                { label: "HIGH", angle: 90, color: "#f87171" },
              ].map(({ label, angle, color }) => {
                const pt = polarToCartesian(centerX, centerY, (outerRadius + innerRadius) / 2, angle);
                return (
                  <text
                    key={label}
                    x={pt.x}
                    y={pt.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="700"
                    letterSpacing="2"
                    fill={color}
                    opacity="0.85"
                  >
                    {label}
                  </text>
                );
              })}

              {/* Needle */}
              {(() => {
                const needleEnd = polarToCartesian(centerX, centerY, needleLength, needleAngle);
                const needleBase1 = polarToCartesian(centerX, centerY, 8, needleAngle + 90);
                const needleBase2 = polarToCartesian(centerX, centerY, 8, needleAngle - 90);

                return (
                  <>
                    {Number.isFinite(needleEnd.x) && Number.isFinite(needleEnd.y) &&
                      Number.isFinite(needleBase1.x) && Number.isFinite(needleBase1.y) &&
                      Number.isFinite(needleBase2.x) && Number.isFinite(needleBase2.y) && (
                        <>
                          {/* Needle shadow/glow layer */}
                          <polygon
                            points={`${needleEnd.x},${needleEnd.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
                            fill={zoneColor}
                            opacity="0.35"
                            filter="url(#needleGlow)"
                          />
                          {/* Needle body */}
                          <polygon
                            points={`${needleEnd.x},${needleEnd.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
                            fill={zoneColor}
                            opacity="0.95"
                          />
                        </>
                      )}
                    {/* Hub outer glow ring */}
                    <circle
                      cx={centerX} cy={centerY} r="18"
                      fill="none"
                      stroke={zoneColor}
                      strokeWidth="1.5"
                      opacity="0.3"
                    />
                    {/* Hub base */}
                    <circle cx={centerX} cy={centerY} r="13" fill="#1e293b" stroke={zoneColor} strokeWidth="1.5" strokeOpacity="0.6" />
                    {/* Hub center dot */}
                    <circle cx={centerX} cy={centerY} r="5" fill={zoneColor} opacity="0.9" />
                    {/* Hub glint */}
                    <circle cx={centerX - 2} cy={centerY - 2} r="2" fill="rgba(255,255,255,0.5)" />
                  </>
                );
              })()}

              {/* Centre readout */}
              {Number.isFinite(animatedSpeed) && (
                <g>
                  <text
                    x={centerX}
                    y={centerY + outerRadius * 0.50}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="28"
                    fontFamily="monospace"
                    fontWeight="800"
                    fill={zoneColor}
                    filter="url(#needleGlow)"
                  >
                    {animatedSpeed}
                  </text>
                  <text
                    x={centerX}
                    y={centerY + outerRadius * 0.50 + 22}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    letterSpacing="3"
                    fill="rgba(150,150,170,0.7)"
                  >
                    ASSIGNED
                  </text>
                </g>
              )}

              {/* Tooltip */}
              {tooltip.show && (
                <g>
                  <rect
                    x={tooltip.x - 70}
                    y={tooltip.y - 55}
                    width="140"
                    height="50"
                    rx="6"
                    fill="rgba(15,17,23,0.92)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                  />
                  <text x={tooltip.x} y={tooltip.y - 38} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="rgba(160,160,180,0.9)" letterSpacing="1">
                    ASSIGNED
                  </text>
                  <text x={tooltip.x} y={tooltip.y - 22} textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="700" fill={zoneColor}>
                    {animatedSpeed} / {customerCount}
                  </text>
                  <polygon
                    points={`${tooltip.x - 8},${tooltip.y - 5} ${tooltip.x + 8},${tooltip.y - 5} ${tooltip.x},${tooltip.y + 8}`}
                    fill="rgba(15,17,23,0.92)"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* User selector */}
          {userCustomers.users.length > 0 && (
            <div className="mt-4 sm:mt-5 flex justify-center shrink-0">
              <div className="relative w-full max-w-[220px]" ref={dropdownRef}>
                {/* Button */}
                <button
                  ref={dropdownButtonRef}
                  onClick={handleDropdownToggle}
                  className="
                    w-full flex items-center justify-between
                    px-4 py-2.5
                    rounded-xl text-sm font-semibold
                    bg-gray-100 hover:bg-gray-200
                    dark:bg-white/5 dark:hover:bg-white/10
                    border border-gray-200 hover:border-gray-300
                    dark:border-white/10 dark:hover:border-white/20
                    text-gray-700 dark:text-gray-200
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-amber-400/40
                    tracking-wide
                  "
                >
                  <span className="truncate">{selectedUser?.name ?? "Select user"}</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-2 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div
                    className={`
                      absolute z-50 w-full mt-1
                      bg-white dark:bg-[#161821]
                      border border-gray-200 dark:border-white/10
                      rounded-xl shadow-2xl dark:shadow-black/60
                      overflow-hidden
                      max-h-52 overflow-y-auto
                      ${dropdownDirection === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}
                    `}
                  >
                    {userCustomers.users.map((user, index) => {
                      const isSelected = selectedUser?.id === user?.id;
                      const pct = (user as any).percentage ?? user.customers;
                      const itemColor =
                        user.customers <= 90 ? '#4ade80'
                        : user.customers <= 210 ? '#fcd34d'
                        : '#f87171';

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDropdownOpen(false);
                          }}
                          className={`
                            w-full flex items-center justify-between
                            px-4 py-3 text-left text-sm transition-colors duration-150
                            ${isSelected
                              ? 'bg-amber-50 dark:bg-amber-400/10'
                              : 'hover:bg-gray-50 dark:hover:bg-white/5'
                            }
                            border-b border-gray-100 dark:border-white/5 last:border-0
                          `}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Accent dot */}
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: itemColor }}
                            />
                            <span
                              className={`truncate font-mono text-xs tracking-wide ${isSelected ? 'text-amber-600 dark:text-amber-300 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                            >
                              {user?.name}
                            </span>
                          </div>
                          <span
                            className="text-xs font-bold ml-3 flex-shrink-0 tabular-nums"
                            style={{ color: itemColor }}
                          >
                            {user?.customers}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}