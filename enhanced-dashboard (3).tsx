import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, ShoppingBag, DollarSign, Award } from "lucide-react";

const SalesDashboard = () => {
  const [filters, setFilters] = useState({
    category: "Children Bicycles",
    store: "Baldwin Bikes",
    year: "2016",
    state: "CA"
  });

  const monthlyData = [
    { name: "Jan", sales: 33880 }, { name: "Feb", sales: 42040 },
    { name: "Mar", sales: 39130 }, { name: "Apr", sales: 30300 },
    { name: "May", sales: 26450 }, { name: "Jun", sales: 33850 },
    { name: "Jul", sales: 44950 }, { name: "Aug", sales: 56610 },
    { name: "Sep", sales: 30850 }, { name: "Oct", sales: 37090 },
    { name: "Nov", sales: 27000 }, { name: "Dec", sales: 32590 }
  ];

  const categoryData = [
    { name: "Children Bicycles", value: 438 },
    { name: "Comfort Bicycles", value: 156 },
    { name: "Cruisers Bicycles", value: 156 }
  ];

  const topCategories = [
    { name: "Children Bicycles", sales: 157800 },
    { name: "Comfort Bicycles", sales: 74900 },
    { name: "Cruisers Bicycles", sales: 252300 }
  ];

  const salesPersonData = [
    { name: "Verta Daniel", sales: 198300 },
    { name: "Marya Copeland", sales: 180400 },
    { name: "Marceline Boyer", sales: 175610 },
    { name: "Layla Terrell", sales: 124510 },
    { name: "Kat Vargas", sales: 98350 },
    { name: "Genna Serrano", sales: 51920 }
  ];

  const regionData = [
    { name: "CA", sales: 89210 },
    { name: "NY", sales: 196500 },
    { name: "TX", sales: 144600 }
  ];

  const COLORS = {
    header: "bg-gradient-to-r from-purple-600 to-pink-500",
    background: "bg-gray-100",
    kpiCards: {
      bg: "bg-white",
      icon: {
        revenue: "text-emerald-500",
        growth: "text-blue-500",
        orders: "text-purple-500",
        average: "text-amber-500",
        top: "text-rose-500"
      }
    },
    charts: {
      region: ["#6366F1", "#EC4899", "#8B5CF6"],
      pie: ["#F59E0B", "#10B981", "#3B82F6"],
      salesPerson: ["#8B5CF6", "#EC4899", "#F43F5E", "#EF4444", "#F59E0B", "#10B981"],
      categories: ["#6366F1", "#8B5CF6", "#EC4899"],
      trend: "#8B5CF6"
    }
  };

  const kpiCards = [
    { 
      title: "Total Revenue 💰", 
      value: "$ 430,310", 
      icon: DollarSign,
      trend: "+12.5%",
      colorClass: COLORS.kpiCards.icon.revenue
    },
    { 
      title: "Sales Growth 📈", 
      value: "99.95%", 
      icon: TrendingUp,
      trend: "+28.4%",
      colorClass: COLORS.kpiCards.icon.growth
    },
    { 
      title: "Total Orders 🛍️", 
      value: "757", 
      icon: ShoppingBag,
      trend: "+8.2%",
      colorClass: COLORS.kpiCards.icon.orders
    },
    { 
      title: "Avg. Order Value 💎", 
      value: "$568.44", 
      icon: Users,
      trend: "+16.8%",
      colorClass: COLORS.kpiCards.icon.average
    },
    { 
      title: "Top Sales Person 🏆", 
      value: "$1,100.00", 
      icon: Award,
      trend: "+22.4%",
      colorClass: COLORS.kpiCards.icon.top
    }
  ];

  const handleFilterChange = (value, name) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatValue = (value) => {
    if (typeof value !== 'number') return value;
    return value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`;
  };

  const renderPieLabel = ({ name, value, percent }) => {
    return `${name}: ${((percent || 0) * 100).toFixed(1)}%`;
  };

  const renderBarLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text 
        x={x + width + 5} 
        y={y} 
        fill="#666" 
        textAnchor="start" 
        dy={16}
        fontSize={12}
      >
        {formatValue(value)}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className={`${COLORS.header} rounded-2xl p-6 mb-6 shadow-lg`}>
        <h1 className="text-3xl font-bold text-white">✨ Sales Performance Dashboard</h1>
        <p className="text-pink-100 mt-2">Real-time insights and analytics 📊</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow hover:scale-105 transform duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{kpi.title}</p>
                <h3 className="text-2xl font-bold mt-2">{kpi.value}</h3>
                <p className="text-sm text-green-500 mt-2">{kpi.trend} vs last month</p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.colorClass} bg-opacity-10`}>
                <kpi.icon className={`w-6 h-6 ${kpi.colorClass}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Filters Section */}
        <div className="w-64 space-y-4">
          <Card className="p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🎯 Filters</h3>
            {[
              {
                name: "Category 🚲",
                options: ["Children Bicycles", "Comfort Bicycles", "Cruisers Bicycles"]
              },
              {
                name: "Store 🏪",
                options: ["Baldwin Bikes", "Rowlett Bikes", "Santa Cruz Bikes"]
              },
              {
                name: "Year 📅",
                options: ["2016", "2017", "2018", "2020"]
              },
              {
                name: "State 📍",
                options: ["CA", "NY", "TX"]
              }
            ].map((filter) => (
              <div key={filter.name} className="mb-4">
                <label className="text-sm text-gray-600 mb-1 block">{filter.name}</label>
                <Select onValueChange={(value) => handleFilterChange(value, filter.name.toLowerCase())}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder={filter.name} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <Card className="col-span-2 p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">📈 Sales Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={formatValue} />
                <Line type="monotone" dataKey="sales" stroke={COLORS.charts.trend} strokeWidth={3}>
                  <LabelList 
                    dataKey="sales" 
                    position="top" 
                    formatter={formatValue}
                    offset={15}
                    style={{ fontSize: '12px' }}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Regional Sales Chart */}
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🗺️ Regional Sales Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={formatValue} />
                <Bar dataKey="sales">
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.charts.region[index % COLORS.charts.region.length]} />
                  ))}
                  <LabelList 
                    dataKey="sales" 
                    position="top" 
                    formatter={formatValue}
                    offset={5}
                    style={{ fontSize: '12px' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Product Categories Chart */}
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🚲 Product Categories Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={renderPieLabel}
                  labelLine={true}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.charts.pie[index % COLORS.charts.pie.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatValue} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Sales Person Performance Chart */}
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🏆 Top Performing Sales Representatives</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                layout="vertical" 
                data={salesPersonData}
                margin={{ top: 20, right: 60, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={formatValue} />
                <Bar dataKey="sales">
                  {salesPersonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.charts.salesPerson[index % COLORS.charts.salesPerson.length]} />
                  ))}
                  <LabelList content={renderBarLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Performance Chart */}
          <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">📊 Category Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={topCategories}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={formatValue} />
                <Bar dataKey="sales">
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.charts.categories[index % COLORS.charts.categories.length]} />
                  ))}
                  <LabelList 
                    dataKey="sales" 
                    position="top" 
                    formatter={formatValue}
                    offset={5}
                    style={{ fontSize: '12px' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
