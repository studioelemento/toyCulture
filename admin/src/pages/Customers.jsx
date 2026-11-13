import React, { useCallback, useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  ShieldOff,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Wallet,
  ShoppingBag,
  Star,
} from "lucide-react";
import { api } from "../lib/apiClient";

const FILTERS = [
  { id: "User",          label: "All" },
  { id: "ActiveUsers",   label: "Active" },
  { id: "InActiveUsers", label: "Blocked" },
  { id: "Unverified",    label: "Unverified" },
  { id: "Google",        label: "Google" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fullName(user) {
  return user?.name || [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || user?.email || "Customer";
}

function StatusBadge({ active, verified }) {
  if (!active) {
    return (
      <span className="inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border-rose-500/20">
        Blocked
      </span>
    );
  }
  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border-amber-500/20">
        Unverified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
      Active
    </span>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("User");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [counts, setCounts] = useState({ total: 0, active: 0, blocked: 0, unverified: 0, google: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        role: "USER",
        filter,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      });
      const data = await api.get(`/api/admin/users?${params}`);
      const list = Array.isArray(data.data) ? data.data : [];
      setCustomers(list);
      setTotalPages(data.pages ?? 1);
      setTotalUsers(data.total_users ?? list.length);
      if (data.counts) setCounts(data.counts);
    } catch (err) {
      setError(err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, filter, searchTerm]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);
  useEffect(() => { setPage(1); }, [filter, searchTerm]);

  const openDetails = async (id) => {
    setSelectedId(id);
    setDetailsLoading(true);
    try {
      const res = await api.get(`/api/admin/users/${id}`);
      setDetails(res.data ?? null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedId(null);
    setDetails(null);
  };

  const toggleState = async (id, currentlyActive) => {
    const action = currentlyActive ? "block" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this customer?`)) return;
    setTogglingId(id);
    try {
      await api.patch(`/api/admin/users/toggle-state/${id}`);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: !currentlyActive } : c))
      );
      if (details?.id === id) {
        setDetails((prev) => (prev ? { ...prev, active: !currentlyActive } : prev));
      }
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Customers</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {loading ? "Loading…" : `${totalUsers} shop customers`} · Stored in PostgreSQL from store signup &amp; Google
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          title="Refresh customers"
          className="p-2.5 bg-[#0E1526] hover:bg-slate-800 border border-indigo-950 text-slate-300 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-400" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniStat label="All customers" value={counts.total} />
        <MiniStat label="Active" value={counts.active} tone="emerald" />
        <MiniStat label="Blocked" value={counts.blocked} tone="rose" />
        <MiniStat label="Unverified" value={counts.unverified} tone="amber" />
      </div>

      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, email or phone…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121A2F] border border-indigo-950 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === item.id
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3" />
            <p>Loading customers…</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-white font-bold">No customers match your filter</p>
            <p className="text-slate-500 text-xs mt-1">Shop registrations and Google sign-ins appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#121A2F]/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-indigo-950/40">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4">Last login</th>
                  <th className="py-3.5 px-4">Orders</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => openDetails(c.id)}
                    className="hover:bg-indigo-950/30 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white text-xs">{fullName(c)}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {c.is_google_login ? "Google" : "Email"}{c.is_verified ? " · verified" : ""}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-200 text-xs">{c.email}</div>
                      <div className="text-slate-500 text-[11px]">{c.phone || "No phone"}</div>
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-300">{formatDate(c.createdAt)}</td>
                    <td className="py-4 px-4 text-xs text-slate-300">{formatDateTime(c.last_login)}</td>
                    <td className="py-4 px-4 text-xs font-bold text-white">{c.orders_count ?? 0}</td>
                    <td className="py-4 px-4"><StatusBadge active={c.active} verified={c.is_verified} /></td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openDetails(c.id)}
                          className="p-1.5 rounded-xl border border-indigo-950/60 bg-indigo-950/30 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all"
                          title="View customer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleState(c.id, c.active)}
                          disabled={togglingId === c.id}
                          className={`p-1.5 rounded-xl border transition-all disabled:opacity-50 ${
                            c.active
                              ? "border-rose-500/20 bg-rose-950/30 hover:bg-rose-600 text-rose-300 hover:text-white"
                              : "border-emerald-500/20 bg-emerald-950/30 hover:bg-emerald-600 text-emerald-300 hover:text-white"
                          }`}
                          title={c.active ? "Block customer" : "Activate customer"}
                        >
                          {c.active ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <p className="text-xs text-slate-400">
          Showing <span className="text-white font-bold">{customers.length === 0 ? 0 : (page - 1) * 10 + 1}–{Math.min(page * 10, totalUsers)}</span> of <span className="text-white font-bold">{totalUsers}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 bg-[#0E1526] border border-indigo-950 text-slate-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white font-bold px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-900/50">
            {page}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 bg-[#0E1526] border border-indigo-950 text-slate-300 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70" onClick={closeDetails}>
          <div
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0E1526] border border-indigo-900/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-indigo-950/80 flex items-center justify-between bg-[#121A2F]/60">
              <div>
                <h3 className="text-lg font-black text-white">{details ? fullName(details) : "Customer"}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{details?.email || "Loading profile…"}</p>
              </div>
              <div className="flex items-center gap-2">
                {details && <StatusBadge active={details.active} verified={details.is_verified} />}
                <button onClick={closeDetails} className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
              {detailsLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3" />
                  <p>Loading customer details…</p>
                </div>
              ) : details ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#121A2F]/40 border border-indigo-950/60 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider">
                        <Mail className="w-3.5 h-3.5" /> Profile
                      </div>
                      <Row icon={Phone} label="Phone" value={details.phone || "—"} />
                      <Row icon={Calendar} label="Joined" value={formatDateTime(details.createdAt)} />
                      <Row icon={Calendar} label="Last login" value={formatDateTime(details.last_login)} />
                      <div className="text-slate-400">Sign-in: <span className="text-white font-semibold">{details.is_google_login ? "Google" : "Email & password"}</span></div>
                      {details.referral_id && <div className="text-slate-400">Referral: <span className="text-white font-mono">{details.referral_id}</span></div>}
                    </div>
                    <div className="p-4 rounded-2xl bg-[#121A2F]/40 border border-indigo-950/60 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider">
                        <Wallet className="w-3.5 h-3.5" /> Activity snapshot
                      </div>
                      <div className="flex justify-between"><span className="text-slate-400">Wallet</span><span className="text-white font-black">₹{Number(details.wallet_balance || 0).toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Orders</span><span className="text-white font-black">{details.totalOrders ?? 0}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Addresses</span><span className="text-white font-black">{details._count?.addresses ?? details.addresses?.length ?? 0}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Reviews</span><span className="text-white font-black">{details._count?.reviews ?? details.reviews?.length ?? 0}</span></div>
                      <button
                        onClick={() => toggleState(details.id, details.active)}
                        disabled={togglingId === details.id}
                        className={`mt-2 w-full py-2 rounded-xl text-xs font-bold disabled:opacity-50 ${
                          details.active ? "bg-rose-600/80 hover:bg-rose-500 text-white" : "bg-emerald-600/80 hover:bg-emerald-500 text-white"
                        }`}
                      >
                        {details.active ? "Block customer" : "Activate customer"}
                      </button>
                    </div>
                  </div>

                  {details.addresses?.length > 0 && (
                    <Section title="Addresses" icon={MapPin}>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {details.addresses.map((a) => (
                          <div key={a.id} className="p-3 rounded-xl bg-[#121A2F]/50 border border-indigo-950/50 text-xs text-slate-300">
                            <div className="text-white font-bold mb-1">
                              {a.first_name} {a.last_name} {a.is_primary && <span className="text-indigo-400 font-semibold">· Primary</span>}
                            </div>
                            <div>{a.address}, {a.place}</div>
                            <div>{a.state} {a.pincode}</div>
                            <div className="text-slate-500 mt-1">{a.phone}</div>
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  <Section title="Recent orders" icon={ShoppingBag}>
                    {details.orders?.length ? (
                      <div className="space-y-2">
                        {details.orders.map((o) => (
                          <div key={o.id} className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#121A2F]/50 border border-indigo-950/50">
                            <div>
                              <div className="text-white font-bold font-mono">{o.order_number}</div>
                              <div className="text-slate-500">{formatDateTime(o.createdAt)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-black">₹{Number(o.total_amount || 0).toLocaleString()}</div>
                              <div className="text-slate-400">{o.status} · {o.payment_status}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No orders yet.</p>
                    )}
                  </Section>

                  {details.reviews?.length > 0 && (
                    <Section title="Reviews" icon={Star}>
                      <div className="space-y-2">
                        {details.reviews.map((r) => (
                          <div key={r.id} className="text-xs p-3 rounded-xl bg-[#121A2F]/50 border border-indigo-950/50">
                            <div className="text-white font-semibold">{r.product?.name || "Product"} · {r.rating}/5</div>
                            {r.comment && <div className="text-slate-400 mt-1">{r.comment}</div>}
                          </div>
                        ))}
                      </div>
                    </Section>
                  )}

                  <Section title="Timeline" icon={Calendar}>
                    <div className="space-y-2">
                      {(details.activity || []).slice(0, 12).map((item, idx) => (
                        <div key={`${item.type}-${idx}`} className="flex gap-3 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                          <div>
                            <div className="text-slate-200">{item.label}</div>
                            <div className="text-slate-500">{formatDateTime(item.at)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                </>
              ) : (
                <p className="text-slate-400 text-sm">Customer not found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, tone = "indigo" }) {
  const tones = {
    indigo: "text-indigo-300",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
  };
  return (
    <div className="bg-[#0E1526] border border-indigo-950/60 rounded-2xl p-4">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
      <div className={`text-2xl font-black mt-1 ${tones[tone]}`}>{value}</div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-slate-300">
      <Icon className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-slate-500">{label}:</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}
