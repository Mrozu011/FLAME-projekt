
'use client';

import { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';

interface DashboardChartsProps {
  analyticsData: {
    revenueData: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
    ordersByStatus: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    topProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
    }>;
    trafficData: Array<{
      date: string;
      visitors: number;
      pageViews: number;
      bounceRate: number;
    }>;
    userGrowthData: Array<{
      month: string;
      users: number;
      newUsers: number;
    }>;
  };
  timeRange: string;
}

export default function DashboardCharts({ analyticsData, timeRange }: DashboardChartsProps) {
  const [activeChart, setActiveChart] = useState('revenue');

  const chartTabs = [
    { id: 'revenue', label: 'Revenue & Orders', icon: 'ri-line-chart-line' },
    { id: 'traffic', label: 'Traffic Insights', icon: 'ri-bar-chart-line' },
    { id: 'users', label: 'User Growth', icon: 'ri-user-add-line' },
    { id: 'products', label: 'Top Products', icon: 'ri-trophy-line' }
  ];

  const statusColors = {
    'Paid': '#10B981',
    'Pending': '#F59E0B',
    'Shipped': '#8B5CF6',
    'Returned': '#F97316',
    'Cancelled': '#EF4444'
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? 
                entry.name.toLowerCase().includes('revenue') ? 
                  `$${entry.value.toLocaleString()}` : 
                  entry.value.toLocaleString()
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderRevenueChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={analyticsData.revenueData}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis yAxisId="revenue" orientation="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          stroke="#3B82F6"
          fill="url(#revenueGradient)"
          strokeWidth={2}
          name="Revenue ($)"
        />
        <Bar
          yAxisId="orders"
          dataKey="orders"
          fill="#10B981"
          name="Orders"
          opacity={0.8}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderTrafficChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={analyticsData.trafficData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis yAxisId="traffic" orientation="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="bounce" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          yAxisId="traffic"
          dataKey="visitors"
          fill="#8B5CF6"
          name="Visitors"
          opacity={0.8}
        />
        <Bar
          yAxisId="traffic"
          dataKey="pageViews"
          fill="#06B6D4"
          name="Page Views"
          opacity={0.8}
        />
        <Line
          yAxisId="bounce"
          type="monotone"
          dataKey="bounceRate"
          stroke="#F59E0B"
          strokeWidth={3}
          name="Bounce Rate (%)"
          dot={{ fill: '#F59E0B', r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderUserGrowthChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={analyticsData.userGrowthData}>
        <defs>
          <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="users"
          stackId="1"
          stroke="#10B981"
          fill="url(#usersGradient)"
          strokeWidth={2}
          name="Total Users"
        />
        <Area
          type="monotone"
          dataKey="newUsers"
          stackId="2"
          stroke="#F59E0B"
          fill="url(#newUsersGradient)"
          strokeWidth={2}
          name="New Users"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderTopProductsChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={analyticsData.topProducts} layout="horizontal" margin={{ left: 100 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          width={100}
          tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
        />
        <Tooltip 
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-blue-600">
                    Sales: {payload[0]?.value} units
                  </p>
                  <p className="text-sm text-green-600">
                    Revenue: ${payload[0]?.payload?.revenue?.toLocaleString()}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="sales" fill="#3B82F6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (activeChart) {
      case 'revenue':
        return renderRevenueChart();
      case 'traffic':
        return renderTrafficChart();
      case 'users':
        return renderUserGrowthChart();
      case 'products':
        return renderTopProductsChart();
      default:
        return renderRevenueChart();
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Chart Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {chartTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeChart === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {renderChart()}
        </div>
      </div>

      {/* Additional Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Status Pie Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Orders by Status</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.status as keyof typeof statusColors]} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{data.status}</p>
                          <p className="text-sm text-gray-600">{data.count} orders ({data.percentage}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Metrics */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Trends</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Visitors"
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Page Views"
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
