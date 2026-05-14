import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  UserCheck,
  Clock,
  Activity,
  Shield,
  Settings,
  FileText,
  MessageSquare,
  Heart,
  Brain,
  CheckCircle,
  XCircle,
  UserX,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Bell,
  Calendar as CalendarIcon,
  User,
  TrendingDown
} from "lucide-react";

const Admin = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDateRange, setSelectedDateRange] = useState('7days');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Enhanced mock data with more comprehensive features
  const mockData = {
    totalScreenings: 250,
    totalUsers: 1240,
    totalSessions: 180,
    totalCounselors: 12,
    activeUsers: 890,
    avgPhq9: 10.2,
    avgGad7: 8.6,
    completionRate: 78.5,
    emergencyAlerts: 5,
    
    // User engagement metrics
    userEngagement: {
      dailyActiveUsers: 320,
      weeklyActiveUsers: 890,
      monthlyActiveUsers: 1240,
      averageSessionDuration: 45,
      bounceRate: 12.5
    },

    // System health
    systemHealth: {
      uptime: 99.8,
      responseTime: 120,
      errorRate: 0.2,
      serverLoad: 65
    },

    // Counselor performance
    counselorPerformance: [
      { name: 'Dr. Sarah Johnson', sessions: 45, rating: 4.9, availability: 85 },
      { name: 'Dr. Michael Chen', sessions: 38, rating: 4.8, availability: 90 },
      { name: 'Dr. Emily Rodriguez', sessions: 42, rating: 4.9, availability: 80 },
      { name: 'Dr. James Wilson', sessions: 35, rating: 4.7, availability: 75 }
    ],

    // Recent activities
    recentActivities: [
      { id: 1, user: 'John Doe', action: 'Completed PHQ-9 screening', time: '2 hours ago', severity: 'moderate' },
      { id: 2, user: 'Jane Smith', action: 'Booked counseling session', time: '3 hours ago', severity: 'normal' },
      { id: 3, user: 'Mike Johnson', action: 'Emergency alert triggered', time: '5 hours ago', severity: 'urgent' },
      { id: 4, user: 'Sarah Williams', action: 'Completed GAD-7 screening', time: '1 day ago', severity: 'mild' }
    ],

    // Crisis management
    crisisAlerts: [
      { id: 1, user: 'Anonymous User #1234', risk: 'High', time: '30 min ago', status: 'pending' },
      { id: 2, user: 'Anonymous User #5678', risk: 'Critical', time: '2 hours ago', status: 'contacted' },
      { id: 3, user: 'Anonymous User #9012', risk: 'Medium', time: '5 hours ago', status: 'resolved' }
    ],

    severityCounts: { minimal: 60, mild: 80, moderate: 70, severe: 40 },
    weeklySubmissions: [
      { week: "Week 1", count: 20, sessions: 15, users: 18 },
      { week: "Week 2", count: 35, sessions: 28, users: 32 },
      { week: "Week 3", count: 42, sessions: 35, users: 40 },
      { week: "Week 4", count: 50, sessions: 42, users: 48 },
      { week: "Week 5", count: 55, sessions: 48, users: 53 },
      { week: "Week 6", count: 48, sessions: 40, users: 46 },
    ],

    // Monthly trends
    monthlyTrends: [
      { month: 'Jan', screenings: 180, sessions: 120, users: 200 },
      { month: 'Feb', screenings: 220, sessions: 150, users: 250 },
      { month: 'Mar', screenings: 280, sessions: 180, users: 320 },
      { month: 'Apr', screenings: 250, sessions: 160, users: 290 },
      { month: 'May', screenings: 320, sessions: 210, users: 380 },
      { month: 'Jun', screenings: 290, sessions: 190, users: 350 }
    ],

    phqBands: { minimal: 40, mild: 90, moderate: 80, severe: 40 },
    gadBands: { minimal: 50, mild: 70, moderate: 90, severe: 40 },

    // Geographic data
    geographicData: [
      { region: 'North Campus', users: 320, sessions: 180 },
      { region: 'South Campus', users: 280, sessions: 160 },
      { region: 'East Campus', users: 240, sessions: 140 },
      { region: 'West Campus', users: 200, sessions: 120 },
      { region: 'Online Only', users: 200, sessions: 100 }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setData(mockData);
      setNotifications([
        { id: 1, message: 'New high-risk user detected', type: 'alert', time: '5 min ago' },
        { id: 2, message: 'System maintenance scheduled', type: 'info', time: '1 hour ago' },
        { id: 3, message: 'Monthly report ready', type: 'success', time: '2 hours ago' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Chart colors
  const severityColors = {
    minimal: "#10B981",
    mild: "#F59E0B",
    moderate: "#F97316",
    severe: "#EF4444",
  };

  // Prepare enhanced chart data
  const severityChartData = data ? [
    { name: "Minimal", value: data.severityCounts.minimal, color: severityColors.minimal },
    { name: "Mild", value: data.severityCounts.mild, color: severityColors.mild },
    { name: "Moderate", value: data.severityCounts.moderate, color: severityColors.moderate },
    { name: "Severe", value: data.severityCounts.severe, color: severityColors.severe },
  ] : [];

  const comparisonData = data ? [
    { name: "Minimal", PHQ9: data.phqBands.minimal, GAD7: data.gadBands.minimal },
    { name: "Mild", PHQ9: data.phqBands.mild, GAD7: data.gadBands.mild },
    { name: "Moderate", PHQ9: data.phqBands.moderate, GAD7: data.gadBands.moderate },
    { name: "Severe", PHQ9: data.phqBands.severe, GAD7: data.gadBands.severe },
  ] : [];

  // Enhanced stats cards data
  const statsCards = data ? [
    { 
      title: 'Total Users', 
      value: data.totalUsers, 
      change: '+12.5%', 
      trend: 'up', 
      icon: Users, 
      color: 'blue',
      description: 'Registered students'
    },
    { 
      title: 'Active Sessions', 
      value: data.totalSessions, 
      change: '+8.3%', 
      trend: 'up', 
      icon: Activity, 
      color: 'green',
      description: 'Counseling sessions'
    },
    { 
      title: 'Completion Rate', 
      value: `${data.completionRate}%`, 
      change: '+3.2%', 
      trend: 'up', 
      icon: CheckCircle, 
      color: 'purple',
      description: 'Assessment completion'
    },
    { 
      title: 'Emergency Alerts', 
      value: data.emergencyAlerts, 
      change: '-15.8%', 
      trend: 'down', 
      icon: AlertTriangle, 
      color: 'red',
      description: 'High-risk cases'
    },
    {
      title: 'Avg PHQ-9 Score',
      value: data.avgPhq9,
      change: '-2.1%',
      trend: 'down',
      icon: Brain,
      color: 'indigo',
      description: 'Depression screening'
    },
    {
      title: 'Avg GAD-7 Score',
      value: data.avgGad7,
      change: '-1.8%',
      trend: 'down',
      icon: Heart,
      color: 'pink',
      description: 'Anxiety screening'
    }
  ] : [];

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {stat.title}
                    </p>
                  </div>
                  <p className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
                    {stat.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="ml-1">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Multi-metric Trend Chart */}
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg border shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Multi-Metric Trends
            </h3>
            <div className="flex space-x-2">
              <select 
                className={`text-sm rounded-md border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} px-3 py-1`}
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data.weeklySubmissions}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
              <XAxis dataKey="week" stroke={darkMode ? "#9CA3AF" : "#6B7280"} fontSize={12} />
              <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="count" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Screenings" />
              <Area type="monotone" dataKey="sessions" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Sessions" />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="New Users" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Severity Distribution */}
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg border shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Severity Distribution
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={severityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {severityChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{item.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities & Crisis Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg border shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Recent Activities
            </h3>
            <button className={`text-sm ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} flex items-center space-x-1`}>
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-opacity-50 hover:bg-gray-100">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.severity === 'urgent' ? 'bg-red-500' :
                  activity.severity === 'moderate' ? 'bg-yellow-500' :
                  activity.severity === 'mild' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {activity.user}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {activity.action}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crisis Management */}
        <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-lg border shadow-sm p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"} flex items-center space-x-2`}>
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Crisis Alerts</span>
            </h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {data.crisisAlerts.filter(alert => alert.status === 'pending').length} Pending
            </span>
          </div>
          <div className="space-y-3">
            {data.crisisAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${
                alert.risk === 'Critical' ? 'border-red-300 bg-red-50' :
                alert.risk === 'High' ? 'border-orange-300 bg-orange-50' :
                'border-yellow-300 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${darkMode ? "text-gray-900" : "text-gray-900"}`}>
                    {alert.user}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alert.risk === 'Critical' ? 'bg-red-200 text-red-800' :
                    alert.risk === 'High' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {alert.risk} Risk
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs text-gray-600`}>{alert.time}</span>
                  <div className="flex space-x-2">
                    {alert.status === 'pending' && (
                      <>
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                          Contact
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700">
                          View Details
                        </button>
                      </>
                    )}
                    {alert.status === 'contacted' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Contacted</span>
                    )}
                    {alert.status === 'resolved' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Resolved</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      {/* User Management Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>User Management</h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Manage student accounts and activity</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className={`pl-10 pr-4 py-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className={`px-4 py-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="at-risk">At Risk</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-sm border`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {data.userEngagement.dailyActiveUsers}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Daily Active</p>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-sm border`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {data.userEngagement.weeklyActiveUsers}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Weekly Active</p>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-sm border`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {data.userEngagement.averageSessionDuration}m
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Avg Session</p>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-sm border`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {data.userEngagement.bounceRate}%
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Bounce Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm border overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? "bg-gray-800" : "bg-white"} divide-y divide-gray-200`}>
              {data && data.users ? data.users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center`}>
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {user.name}
                        </div>
                        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'At Risk' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.risk === 'High' ? 'bg-red-100 text-red-800' :
                      user.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.risk}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {user.lastActivity}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {user.sessions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Advanced Analytics</h2>
        <div className="flex space-x-3">
          <select className={`px-4 py-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm border p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
          Monthly Trends Comparison
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
            <XAxis dataKey="month" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
            <YAxis stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="screenings" stroke="#3B82F6" strokeWidth={3} name="Screenings" />
            <Line type="monotone" dataKey="sessions" stroke="#10B981" strokeWidth={3} name="Sessions" />
            <Line type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={3} name="New Users" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm border p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Geographic Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.geographicData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#E5E7EB"} />
              <XAxis type="number" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
              <YAxis dataKey="region" type="category" stroke={darkMode ? "#9CA3AF" : "#6B7280"} width={100} />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" name="Users" />
              <Bar dataKey="sessions" fill="#10B981" name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* System Health Metrics */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm border p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            System Health
          </h3>
          <div className="space-y-4">
            {data.systemHealthMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{metric.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${metric.color}-500`}
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCounselorsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Counselor Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Add Counselor</span>
        </button>
      </div>

      {/* Counselor Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.counselorPerformance.map((counselor, index) => (
          <div key={index} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm border p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {counselor.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {counselor.rating}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Sessions</span>
                <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {counselor.sessions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Availability</span>
                <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {counselor.availability}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${counselor.availability}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm hover:bg-blue-700">
                View Schedule
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Enhanced Header */}
      <header className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b shadow-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Admin Dashboard
              </h1>
              <div className="hidden md:flex space-x-1">
                {['overview', 'users', 'analytics', 'counselors'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-100 text-blue-700'
                        : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-lg transition-colors relative ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-20`}>
                    <div className="p-4">
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                      <div className="mt-2 space-y-3">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'alert' ? 'bg-red-500' :
                              notification.type === 'success' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <button
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'counselors' && renderCounselorsTab()}
      </main>

      {/* Enhanced Footer */}
      <footer className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              All analytics are anonymized and aggregated to protect student privacy.
            </p>
            <div className="flex items-center space-x-4">
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Last updated: {new Date().toLocaleString()}
              </span>
              <button className="text-xs text-blue-600 hover:text-blue-700">
                System Status
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;