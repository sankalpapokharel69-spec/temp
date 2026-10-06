import React, { useState } from 'react';
import { Users, Search, ShieldCheck, Mail, Calendar, DollarSign, ShoppingBag } from 'lucide-react';
import { StorageService } from '../../utils/storage';
import { User, Order } from '../../types';

export const AdminCustomers: React.FC = () => {
  const [users] = useState<User[]>(() => StorageService.getUsers());
  const orders = StorageService.getOrders();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-['Poppins']">
            Registered Customers & User Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View customer accounts, roles, purchase volumes, and join dates.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3 font-semibold">User Profile</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Orders Count</th>
                <th className="px-6 py-3 font-semibold">Total Spent</th>
                <th className="px-6 py-3 font-semibold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map(user => {
                const userOrders = orders.filter(
                  o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase()
                );
                const userSpent = userOrders
                  .filter(o => o.status === 'Paid' || o.status === 'Completed')
                  .reduce((sum, o) => sum + o.totalAmount, 0);

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=6366f1`}
                        alt={user.name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                      />
                      <div>
                        <strong className="text-slate-900 dark:text-white block font-medium">
                          {user.name}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {user.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {userOrders.length} Order{userOrders.length === 1 ? '' : 's'}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${userSpent}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
