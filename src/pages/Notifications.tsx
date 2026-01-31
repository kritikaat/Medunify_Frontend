import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertOctagon,
  CheckCircle,
  TrendingUp,
  Eye,
  Bell,
  Settings,
  Trash2,
  MailCheck,
  FileText,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const notifications = [
  {
    id: 1,
    type: 'critical',
    icon: AlertOctagon,
    title: 'Critical Value Detected',
    message: 'Your creatinine level (1.4 mg/dL) is significantly elevated. This may indicate kidney issues.',
    time: '2 hours ago',
    read: false,
    actionLink: '/reports/4',
    actionLabel: 'View Report',
  },
  {
    id: 2,
    type: 'success',
    icon: CheckCircle,
    title: 'Report Processed Successfully',
    message: 'Your lab report from City General Hospital has been analyzed and added to your timeline.',
    time: '5 hours ago',
    read: false,
    actionLink: '/timeline',
    actionLabel: 'View Timeline',
  },
  {
    id: 3,
    type: 'trend',
    icon: TrendingUp,
    title: 'Trend Alert: HbA1c Rising',
    message: 'Your HbA1c has increased by 0.5% over the last 3 months. Consider consulting your doctor.',
    time: '1 day ago',
    read: true,
    actionLink: '/timeline',
    actionLabel: 'View Trend',
  },
  {
    id: 4,
    type: 'activity',
    icon: Eye,
    title: 'Profile Viewed',
    message: 'Dr. Smith viewed your shared health profile.',
    time: '2 days ago',
    read: true,
    actionLink: '/share',
    actionLabel: 'Manage Shares',
  },
  {
    id: 5,
    type: 'system',
    icon: Bell,
    title: 'New Feature Available',
    message: 'AI-powered symptom checker is now available. Try it out!',
    time: '3 days ago',
    read: true,
    actionLink: '/assessment',
    actionLabel: 'Try Now',
  },
  {
    id: 6,
    type: 'success',
    icon: FileText,
    title: 'Monthly Summary Ready',
    message: 'Your January 2025 health summary is ready to view.',
    time: '1 week ago',
    read: true,
    actionLink: '/dashboard',
    actionLabel: 'View Summary',
  },
];

const filterTabs = ['All', 'Unread', 'Critical', 'Trends', 'Activity', 'System'];

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notificationList, setNotificationList] = useState(notifications);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-error/10 text-error';
      case 'success':
        return 'bg-success/10 text-success';
      case 'trend':
        return 'bg-warning/10 text-warning';
      case 'activity':
        return 'bg-muted text-muted-foreground';
      case 'system':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const markAsRead = (id: number) => {
    setNotificationList(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationList(prev =>
      prev.filter(n => n.id !== id)
    );
  };

  const filteredNotifications = notificationList.filter(n => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Critical') return n.type === 'critical';
    if (activeFilter === 'Trends') return n.type === 'trend';
    if (activeFilter === 'Activity') return n.type === 'activity';
    if (activeFilter === 'System') return n.type === 'system';
    return true;
  });

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        
        <main className="p-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
                  Notifications
                </h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={markAllAsRead}>
                  <MailCheck className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/settings">
                    <Settings className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 p-1 bg-card border border-border rounded-xl mb-6 overflow-x-auto"
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeFilter === tab
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab}
                  {tab === 'Unread' && unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-error text-error-foreground text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>

            {/* Notifications List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeFilter === 'All'
                      ? "You're all caught up!"
                      : `No ${activeFilter.toLowerCase()} notifications`}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification, i) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group bg-card rounded-xl border border-border p-4 transition-all hover:shadow-green-sm ${
                      !notification.read ? 'border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        <notification.icon className={`w-5 h-5 ${notification.type === 'critical' ? 'animate-pulse' : ''}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-foreground mb-1">
                              {notification.title}
                              {!notification.read && (
                                <Badge className="ml-2 bg-primary/10 text-primary text-xs">New</Badge>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <MailCheck className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-error hover:text-error"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {notification.actionLink && (
                          <Button variant="outline" size="sm" className="mt-3" asChild>
                            <Link to={notification.actionLink}>
                              {notification.actionLabel}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
