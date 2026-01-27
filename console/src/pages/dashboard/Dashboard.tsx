import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import {
  BiTrendingUp,
  BiTrendingDown,
  BiUserVoice,
  BiGroup,
  BiBookReader,
  BiRupee,
  BiDotsHorizontalRounded,
  BiTimeFive,
  BiVideo,
  BiMapPin,
} from "react-icons/bi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// --- Mock Data ---

const statsData = [
  {
    id: 1,
    label: "Total Revenue",
    value: "₹8,54,230",
    trend: "+12.5%",
    trendUp: true,
    note: "vs last month",
    icon: BiRupee,
    // Modern Gradient Style
    gradient: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-100",
  },
  {
    id: 2,
    label: "Active Students",
    value: "1,240",
    trend: "+5.2%",
    trendUp: true,
    note: "vs last month",
    icon: BiGroup,
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-100",
  },
  {
    id: 3,
    label: "Mentors & Staff",
    value: "45",
    trend: "+2 new",
    trendUp: true,
    note: "vs last month",
    icon: BiUserVoice,
    gradient: "from-orange-400 to-pink-500",
    shadow: "shadow-orange-100",
  },
  {
    id: 4,
    label: "Courses Active",
    value: "24",
    trend: "-1 closed",
    trendUp: false,
    note: "vs last month",
    icon: BiBookReader,
    gradient: "from-emerald-400 to-teal-500",
    shadow: "shadow-emerald-100",
  },
];

const feeData = [
  { name: "Jan", collected: 45000, pending: 12000 },
  { name: "Feb", collected: 52000, pending: 8000 },
  { name: "Mar", collected: 48000, pending: 15000 },
  { name: "Apr", collected: 61000, pending: 5000 },
  { name: "May", collected: 55000, pending: 10000 },
  { name: "Jun", collected: 67000, pending: 4000 },
  { name: "Jul", collected: 72000, pending: 3000 },
];

const studentStreamData = [
  { name: "Science (PCM)", value: 450 },
  { name: "Science (PCB)", value: 320 },
  { name: "Commerce", value: 280 },
  { name: "Arts", value: 190 },
];
const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

const attendanceData = [
  { subject: "Physics", val: 85 },
  { subject: "Chem", val: 78 },
  { subject: "Maths", val: 92 },
  { subject: "Eng", val: 88 },
  { subject: "Bio", val: 82 },
];

const upcomingClasses = [
  {
    id: 1,
    subject: "Physics - Thermodynamics",
    mentor: "Dr. A. P. Singh",
    time: "10:00 AM - 11:30 AM",
    status: "Live Now",
    type: "Online",
  },
  {
    id: 2,
    subject: "Maths - Calculus",
    mentor: "Mr. R. Sharma",
    time: "12:30 PM - 02:00 PM",
    status: "Upcoming",
    type: "Offline (Room 302)",
  },
  {
    id: 3,
    subject: "Chemistry - Organic",
    mentor: "Ms. K. Rao",
    time: "02:00 PM - 03:30 PM",
    status: "Upcoming",
    type: "Online",
  },
];

const recentEnrollments = [
  {
    id: "ST001",
    name: "Rahul Verma",
    img: "https://i.pravatar.cc/150?u=1",
    course: "JEE Mains",
    date: "Jan 24",
    status: "Paid",
    amount: "₹15,000",
  },
  {
    id: "ST002",
    name: "Sneha Gupta",
    img: "https://i.pravatar.cc/150?u=2",
    course: "NEET Fdn.",
    date: "Jan 23",
    status: "Pending",
    amount: "₹25,000",
  },
  {
    id: "ST003",
    name: "Amit Kumar",
    img: "https://i.pravatar.cc/150?u=3",
    course: "Class 12",
    date: "Jan 23",
    status: "Paid",
    amount: "₹8,000",
  },
  {
    id: "ST004",
    name: "Priya Singh",
    img: "https://i.pravatar.cc/150?u=4",
    course: "Commerce",
    date: "Jan 22",
    status: "Paid",
    amount: "₹12,000",
  },
];

// --- Custom Components ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl text-xs">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-400 mx-auto pb-10">
      {/* 1. Minimal Header */}
      <div className="flex flex-col gap-1">
        <Breadcrumbs title="Dashboard" breadcrumbs={[{ label: "Overview" }]} />
      </div>

      {/* 2. Modern Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white p-6 rounded-3xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {item.label}
                </p>
                <h3 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
                  {item.value}
                </h3>
              </div>
              <div
                className={`p-3.5 rounded-2xl bg-linear-to-br ${item.gradient} shadow-lg text-white`}
              >
                <item.icon size={22} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span
                className={`flex items-center font-bold px-2 py-1 rounded-full bg-opacity-10 ${item.trendUp ? "text-green-600 bg-green-100" : "text-red-500 bg-red-100"}`}
              >
                {item.trendUp ? (
                  <BiTrendingUp className="mr-1" />
                ) : (
                  <BiTrendingDown className="mr-1" />
                )}
                {item.trend}
              </span>
              <span className="text-gray-400 text-xs font-medium">
                {item.note}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart - Fee Collection */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Financial Overview
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Fee collection vs pending dues
              </p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
              <BiDotsHorizontalRounded size={24} />
            </button>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={feeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorCollected"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorCollected)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="#fb7185"
                  strokeWidth={3}
                  fill="url(#colorPending)"
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart - Student Streams */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Student Streams
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Distribution by academic focus
          </p>

          <div className="flex-1 min-h-75 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentStreamData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {studentStreamData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs font-medium text-gray-600 ml-1">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-10">
              <span className="text-3xl font-extrabold text-gray-900">
                1.2k
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                Students
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Attendance, Classes, & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Attendance (%)
          </h3>
          <div className="h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} barSize={24}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="subject"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  dy={10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f9fafb" }}
                />
                <Bar dataKey="val" fill="#3b82f6" radius={[6, 6, 6, 6]}>
                  {attendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.val > 90 ? "#10b981" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Classes Feed */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Live & Upcoming</h3>
            <button className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {upcomingClasses.map((item) => (
              <div
                key={item.id}
                className="group flex items-start gap-4 p-3.5 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all cursor-default"
              >
                <div
                  className={`p-3 rounded-xl shrink-0 ${item.status === "Live Now" ? "bg-red-50 text-red-500" : "bg-indigo-50 text-indigo-500"}`}
                >
                  {item.status === "Live Now" ? (
                    <BiVideo size={20} />
                  ) : (
                    <BiTimeFive size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm truncate">
                      {item.subject}
                    </h4>
                    {item.status === "Live Now" && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    by {item.mentor}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-100 shadow-sm">
                      {item.time}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <BiMapPin /> {item.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-lg font-bold text-gray-900">Enrollments</h3>
            <span className="text-xs font-medium text-gray-400">Recent 5</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {recentEnrollments.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.img}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-gray-100"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {order.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.course}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {order.amount}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide ${
                          order.status === "Paid"
                            ? "text-emerald-500"
                            : "text-amber-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">
            Recent Enrollments
          </h3>
          <button className="text-sm font-semibold text-purple-600 hover:text-purple-700">
            View All Transactions
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Fees Paid
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEnrollments.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-purple-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {order.name}
                    <div className="text-xs text-gray-400 font-normal">
                      {order.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.course}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-bold">
                    {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
