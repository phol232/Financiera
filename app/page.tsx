'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { month: 'Jan', earning: 25000, expenses: 20000 },
  { month: 'Feb', earning: 28000, expenses: 22000 },
  { month: 'Mar', earning: 32000, expenses: 25000 },
  { month: 'Apr', earning: 30000, expenses: 24000 },
  { month: 'May', earning: 80000, expenses: 35000 },
  { month: 'Jun', earning: 45000, expenses: 30000 },
  { month: 'Jul', earning: 50000, expenses: 32000 },
  { month: 'Aug', earning: 48000, expenses: 31000 },
  { month: 'Sep', earning: 75000, expenses: 40000 },
];

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/ 82,620.00</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8% respecto al mes anterior</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">S/ 54,870.00</div>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  <span>-2% respecto al mes anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Monitoring Overview</CardTitle>
              <select className="rounded-md border border-gray-300 px-3 py-1 text-sm">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Yearly</option>
              </select>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Earning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Expenses</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="earning"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Earning"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Transaction</CardTitle>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm"
                />
                <Button variant="outline" size="sm">
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="rounded" />
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-medium">DE254839</p>
                      <p className="text-sm text-gray-500">Esther Howard</p>
                      <p className="text-xs text-gray-400">howard@gmail.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">28 Dec 2025</p>
                    <p className="text-sm font-semibold">$ 582.479.00</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Success
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" className="rounded" />
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-medium">DE254840</p>
                      <p className="text-sm text-gray-500">Kristin Watson</p>
                      <p className="text-xs text-gray-400">watson@gmail.com</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">14 Feb 2025</p>
                    <p className="text-sm font-semibold">$ 235.241.00</p>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Pending
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
