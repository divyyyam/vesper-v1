"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Mail, FileText, Search, Filter, RefreshCw } from 'lucide-react';

// Types based on your schema
interface User {
  name: string;
  email: string;
  walletAddress: string;
}

interface Appointment {
  id: string;
  title: string;
  description: string;
  reason: string;
  userEmail: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface AppointmentsResponse {
  success: boolean;
  appointments: Appointment[];
  total: number;
  limit: number;
  offset: number;
  message?: string;
}

// Mock data for demonstration
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Contract Review Meeting',
    description: 'Review and discuss the terms of the employment contract with focus on non-compete clauses and compensation structure.',
    reason: 'Employment Contract Review',
    userEmail: 'john.smith@email.com',
    scheduledAt: '2025-08-25T10:00:00Z',
    createdAt: '2025-08-19T08:30:00Z',
    updatedAt: '2025-08-19T08:30:00Z',
    user: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      walletAddress: '0x1234...5678'
    }
  },
  {
    id: '2',
    title: 'Divorce Consultation',
    description: 'Initial consultation regarding divorce proceedings, asset division, and child custody arrangements.',
    reason: 'Family Law - Divorce',
    userEmail: 'sarah.johnson@email.com',
    scheduledAt: '2025-08-26T14:30:00Z',
    createdAt: '2025-08-18T15:45:00Z',
    updatedAt: '2025-08-18T15:45:00Z',
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      walletAddress: '0xabcd...efgh'
    }
  },
  {
    id: '3',
    title: 'Business Partnership Dispute',
    description: 'Discussion about resolving partnership dispute related to profit sharing and decision-making authority.',
    reason: 'Business Law Dispute',
    userEmail: 'mike.wilson@email.com',
    scheduledAt: '2025-08-27T09:15:00Z',
    createdAt: '2025-08-17T11:20:00Z',
    updatedAt: '2025-08-17T11:20:00Z',
    user: {
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      walletAddress: '0x9876...4321'
    }
  },
  {
    id: '4',
    title: 'Property Purchase Legal Review',
    description: 'Legal review of property purchase agreement, title verification, and closing documentation.',
    reason: 'Real Estate Transaction',
    userEmail: 'emma.davis@email.com',
    scheduledAt: '2025-08-28T16:00:00Z',
    createdAt: '2025-08-16T09:10:00Z',
    updatedAt: '2025-08-16T09:10:00Z',
    user: {
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      walletAddress: '0xfedc...ba98'
    }
  }
];

export default function LawyerAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('');
  const [lawyerEmail, setLawyerEmail] = useState('lawyer@example.com');
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  // Mock toast implementation
  const toast = {
    error: (title: string, options?: any) => console.error(title, options?.description || ""),
    success: (title: string, options?: any) => console.log(title, options?.description || ""),
    info: (title: string, options?: any) => console.info(title, options?.description || ""),
  };

  // Simulate API call with mock data
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      const filteredAppointments = mockAppointments.filter(appointment => {
        const matchesSearch = searchTerm === '' || 
          appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterReason === '' || 
          appointment.reason.toLowerCase().includes(filterReason.toLowerCase());
        
        return matchesSearch && matchesFilter;
      });

      setAppointments(filteredAppointments);
      setTotal(filteredAppointments.length);
      
      toast.success('Appointments loaded successfully');
    } catch (err) {
      const errorMessage = 'Failed to fetch appointments';
      setError(errorMessage);
      toast.error('Error', { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lawyerEmail) {
      fetchAppointments();
    }
  }, [lawyerEmail, searchTerm, filterReason]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const getStatusBadge = (scheduledAt: string) => {
    const now = new Date();
    const appointmentDate = new Date(scheduledAt);
    const diffHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) {
      return <Badge variant="secondary">Completed</Badge>;
    } else if (diffHours < 24) {
      return <Badge variant="destructive">Today</Badge>;
    } else if (diffHours < 48) {
      return <Badge variant="default">Tomorrow</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  const uniqueReasons = [...new Set(mockAppointments.map(apt => apt.reason))];

  if (!lawyerEmail) {
    return (
      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-32 py-8 bg-[#0b0f19] text-slate-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 bg-slate-900 border-slate-800 text-slate-100 shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Authentication Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4 text-sm">Please enter your lawyer email to view appointments.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-slate-200 text-sm font-semibold mb-2 block">Lawyer Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={lawyerEmail}
                    onChange={(e) => setLawyerEmail(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>
                <Button onClick={() => fetchAppointments()} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl">
                  Load Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-32 py-8 bg-[#0b0f19] text-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Client Appointments
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Manage and view your scheduled client consultations
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAppointments}
              disabled={loading}
              className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800/80 shadow-xl rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="p-3 bg-blue-950/80 border border-blue-800/40 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-400">Total</p>
                  <p className="text-2xl font-extrabold text-white">{total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800/80 shadow-xl rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-950/80 border border-emerald-800/40 rounded-xl">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-400">Upcoming</p>
                  <p className="text-2xl font-extrabold text-white">
                    {appointments.filter(apt => isUpcoming(apt.scheduledAt)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800/80 shadow-xl rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="p-3 bg-purple-950/80 border border-purple-800/40 rounded-xl">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-400">Clients</p>
                  <p className="text-2xl font-extrabold text-white">
                    {new Set(appointments.map(apt => apt.userEmail)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800/80 shadow-xl rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="p-3 bg-amber-950/80 border border-amber-800/40 rounded-xl">
                  <FileText className="w-6 h-6 text-amber-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-semibold text-slate-400">Today</p>
                  <p className="text-2xl font-extrabold text-white">
                    {appointments.filter(apt => {
                      const today = new Date().toDateString();
                      return new Date(apt.scheduledAt).toDateString() === today;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-slate-900 border-slate-800 shadow-xl rounded-2xl">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="text-slate-200 text-sm font-semibold mb-2 block">Search Appointments</Label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by title, client, or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="reason-filter" className="text-slate-200 text-sm font-semibold mb-2 block">Filter by Reason</Label>
                <select
                  id="reason-filter"
                  value={filterReason}
                  onChange={(e) => setFilterReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value="" className="bg-slate-900 text-slate-100">All Reasons</option>
                  {uniqueReasons.map(reason => (
                    <option key={reason} value={reason} className="bg-slate-900 text-slate-100">{reason}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterReason('');
                  }}
                  className="w-full bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-slate-300 font-medium">Loading appointments...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-6 bg-slate-900 border-rose-800/60 rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="text-rose-400 mb-2">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Error Loading Appointments</h3>
              </div>
              <p className="text-slate-300 mb-4 text-sm">{error}</p>
              <Button onClick={fetchAppointments} variant="outline" className="bg-slate-950 border-slate-800 text-slate-200">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        {!loading && !error && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <Card className="bg-slate-900 border-slate-800 rounded-2xl p-12 text-center">
                <CardContent className="p-0">
                  <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    No Appointments Found
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {searchTerm || filterReason 
                      ? "No appointments match your current filters."
                      : "You don't have any appointments scheduled yet."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment.id} className="bg-slate-900 border-slate-800/80 rounded-2xl shadow-xl hover:border-slate-700 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">
                              {appointment.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusBadge(appointment.scheduledAt)}
                              <Badge variant="outline" className="border-slate-700 text-purple-300 bg-purple-950/40">{appointment.reason}</Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed">
                          {appointment.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center text-sm text-slate-300">
                            <User className="w-4 h-4 mr-2 text-indigo-400" />
                            <div>
                              <p className="font-semibold text-white">{appointment.user.name}</p>
                              <p className="text-xs text-slate-400">{appointment.user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-slate-300">
                            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                            <div>
                              <p className="font-semibold text-white">{formatDate(appointment.scheduledAt)}</p>
                              <p className="text-xs text-slate-400">{formatTime(appointment.scheduledAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                        <Button variant="outline" size="sm" className="w-full bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl">
                          <Mail className="w-4 h-4 mr-2 text-indigo-400" />
                          Contact
                        </Button>
                        <Button variant="default" size="sm" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl">
                          <FileText className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination Info */}
        {!loading && !error && appointments.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-400">
            Showing {appointments.length} of {total} appointments
          </div>
        )}
      </div>
    </div>
  );
}
