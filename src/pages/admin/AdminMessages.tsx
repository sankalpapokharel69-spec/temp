import React, { useState } from 'react';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  ExternalLink, 
  LifeBuoy, 
  Search, 
  Filter, 
  MessageSquare,
  Check 
} from 'lucide-react';
import { StorageService } from '../../utils/storage';
import { ContactMessage } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminMessages: React.FC = () => {
  const { success, error, info } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>(() => StorageService.getMessages());
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'tickets'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const toggleStatus = (id: string, currentStatus: ContactMessage['status']) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    StorageService.updateMessageStatus(id, nextStatus);
    setMessages(StorageService.getMessages());
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: nextStatus });
    }
    info('Status Updated', `Message marked as ${nextStatus}.`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this message permanently?')) {
      StorageService.deleteMessage(id);
      setMessages(StorageService.getMessages());
      if (selectedMessage?.id === id) setSelectedMessage(null);
      success('Message Deleted');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread' && m.status !== 'unread') return false;
    if (filter === 'read' && m.status !== 'read') return false;
    if (filter === 'tickets' && !m.isTicket) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.senderName.toLowerCase().includes(q);
      const matchEmail = m.senderEmail.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchSubject && !matchMsg) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">
            Support Inbox & Customer Inquiries
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Read messages from the contact form and support ticket helpdesk.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'all' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'unread' ? 'bg-white dark:bg-slate-900 text-rose-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Unread ({messages.filter(m => m.status === 'unread').length})
            </button>
            <button
              onClick={() => setFilter('tickets')}
              className={`px-3 py-1 rounded-lg transition ${
                filter === 'tickets' ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Tickets ({messages.filter(m => m.isTicket).length})
            </button>
          </div>
        </div>
      </div>

      {/* Two pane: Message List on Left, Detail Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredMessages.length > 0 ? (
            filteredMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'unread') {
                    StorageService.updateMessageStatus(msg.id, 'read');
                    setMessages(StorageService.getMessages());
                  }
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedMessage?.id === msg.id
                    ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-sm'
                    : msg.status === 'unread'
                    ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    {msg.status === 'unread' ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    )}
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                      {msg.senderName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {msg.subject}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {msg.message}
                </p>

                <div className="mt-2.5 flex items-center justify-between text-[10px]">
                  {msg.isTicket ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                      Support Ticket
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Inquiry
                    </span>
                  )}
                  <span className="text-slate-400 font-mono">{msg.senderEmail}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No messages match this filter.
            </div>
          )}
        </div>

        {/* Message Viewer Details (7 cols) */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedMessage.isTicket ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {selectedMessage.isTicket ? 'Helpdesk Ticket' : 'Contact Message'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins']">
                    {selectedMessage.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleStatus(selectedMessage.id, selectedMessage.status)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={selectedMessage.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                  >
                    {selectedMessage.status === 'unread' ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">From</span>
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    {selectedMessage.senderName}
                  </strong>
                  <span className="text-slate-500 block">{selectedMessage.senderEmail}</span>
                </div>

                <a
                  href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Reply via Mailto</span>
                </a>
              </div>

              {/* Body */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap p-2">
                {selectedMessage.message}
              </div>

            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Message Selected</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Select a message or ticket from the list on the left to read and respond.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
