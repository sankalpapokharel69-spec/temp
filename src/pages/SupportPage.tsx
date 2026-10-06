import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  LifeBuoy, 
  Send, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Search 
} from 'lucide-react';
import { StorageService } from '../utils/storage';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Licensing',
    question: 'Can I use WebCraft Studio templates for multiple commercial client websites?',
    answer: 'Yes! Every purchase grants you a perpetual, royalty-free commercial license. You are allowed to build websites for yourself or your paying clients with no limit on client billings.'
  },
  {
    category: 'Payment & Verification',
    question: 'How do eSewa, Khalti, and Bank QR payments work?',
    answer: 'During checkout, you simply scan the displayed QR code or transfer to our registered Merchant ID, then enter your transaction reference number and attach your payment receipt screenshot. Our administrators promptly review the slip, approve the status to "Paid", and your template ZIP download unlocks instantly in your "My Account" area.'
  },
  {
    category: 'Downloads',
    question: 'What is included in the template ZIP download?',
    answer: 'Your download contains the pristine, production-ready source code including semantic index.html, styled CSS stylesheets with variables, vanilla JavaScript logic, asset images, and a comprehensive README.md quick-start guide.'
  },
  {
    category: 'Hosting & Deployment',
    question: 'Can I host these templates on GitHub Pages, Cloudflare Pages, or Render for free?',
    answer: 'Absolutely. Because our templates are built using pure HTML, CSS, and vanilla JavaScript without server lock-in or heavy npm dependencies, they can be uploaded directly to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or Render with zero build steps.'
  },
  {
    category: 'Customization',
    question: 'Do I need React, Node.js, or complex npm tools to edit the templates?',
    answer: 'No! You can open the downloaded folder in any standard text editor (VS Code, Cursor, Sublime, Notepad++) and double-click index.html to preview in Chrome, Safari, Edge, or Firefox immediately.'
  },
  {
    category: 'Refunds',
    question: 'What is your refund policy?',
    answer: 'Due to the digital nature of source code archives, once a template ZIP file has been downloaded, sales are generally final. However, if you encounter an unresolvable technical defect, our engineering support will either fix the issue within 24 hours or issue a full refund.'
  }
];

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState('');
  
  // Ticket form
  const [ticketName, setTicketName] = useState(user?.name || '');
  const [ticketEmail, setTicketEmail] = useState(user?.email || '');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(
    f => f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
         f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
         f.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketEmail.trim() || !ticketSubject.trim() || !ticketMessage.trim()) {
      error('Required Fields Missing', 'Please fill out all fields to submit your ticket.');
      return;
    }

    setIsSubmitting(true);
    try {
      StorageService.addMessage({
        senderName: ticketName.trim(),
        senderEmail: ticketEmail.trim().toLowerCase(),
        subject: `[Support Ticket] ${ticketSubject.trim()}`,
        message: ticketMessage.trim(),
        isTicket: true,
      });

      success('Support Ticket Created!', 'Your ticket has been logged in our helpdesk system.');
      setTicketSubmitted(true);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err: any) {
      error('Failed to submit ticket', err.message || 'Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Knowledge Base & Helpdesk
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Poppins']">
          Frequently Asked Questions & Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Find fast answers regarding template licensing, payment verification, and downloads.
        </p>

        {/* Search FAQ */}
        <div className="pt-4 max-w-md mx-auto relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder="Search FAQs (licensing, eSewa, downloads...)"
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: FAQ Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Poppins'] mb-4">
            Common Inquiries & Answers
          </h3>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      <p>{faq.answer}</p>
                      <span className="inline-block mt-3 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Support Ticket Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6 sticky top-24">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Poppins']">
                  Open a Support Ticket
                </h3>
                <p className="text-[11px] text-slate-400">Direct assistance from our template architects.</p>
              </div>
            </div>

            {ticketSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ticket Submitted!</h4>
                <p className="text-xs text-slate-500">
                  We have logged your ticket and our engineers will reply to your email shortly.
                </p>
                <button
                  onClick={() => setTicketSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Subject / Order ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Help with Order #ORD-123456 or CSS custom variables"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Describe Your Issue *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide details about the issue or question..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
