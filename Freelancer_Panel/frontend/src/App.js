import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, NavLink, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { store } from "./app/store";
import { loginUser, logout, registerUser } from "./features/authSlice";
import { fetchDashboard } from "./features/dashboardSlice";
import { fetchJobs } from "./features/jobsSlice";
import { editProposal, fetchMyProposals, submitProposal, withdrawProposal } from "./features/proposalsSlice";
import { fetchRates } from "./features/currencySlice";
import API from "./utils/api";

const socket = io(process.env.REACT_APP_API_ROOT || "http://localhost:5000", { autoConnect: false });

const shellCard = "rounded-xl border border-slate-800 bg-slate-900/90 p-4";

function AuthPage({ mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const action = mode === "signup" ? registerUser(form) : loginUser({ email: form.email, password: form.password });
    const res = await dispatch(action);
    if (!res.error) navigate("/dashboard");
  };

  return <div className="flex min-h-screen items-center justify-center p-4"><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 p-6">
    <h1 className="text-2xl font-bold">{mode === "signup" ? "Freelancer Signup" : "Freelancer Login"}</h1>
    <p className="mb-5 text-sm text-slate-400">Clean and modern freelancer workflow.</p>
    {mode === "signup" && <input className="mb-3 w-full rounded bg-slate-900 p-3" placeholder="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required />}
    <input className="mb-3 w-full rounded bg-slate-900 p-3" type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} required />
    <input className="mb-3 w-full rounded bg-slate-900 p-3" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} required />
    {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
    <button className="w-full rounded bg-emerald-400 p-3 font-semibold text-slate-950">{loading ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}</button>
    <div className="mt-4 text-sm text-slate-400">{mode === "signup" ? <NavLink to="/login" className="text-emerald-400">Already have account?</NavLink> : <NavLink to="/signup" className="text-emerald-400">Create freelancer account</NavLink>}</div>
  </form></div>;
}

function Protected({ children }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const menu = ["dashboard", "profile", "jobs", "proposals", "chat"];

  return <div className="min-h-screen"><header className="border-b border-slate-800 bg-slate-950/90"><div className="mx-auto flex max-w-7xl items-center justify-between p-4">
    <h1 className="text-xl font-semibold">FreelanceHub <span className="text-emerald-400">Freelancer</span></h1>
    <div className="flex items-center gap-3"><span>{user?.name}</span><button className="rounded bg-emerald-400 px-3 py-1 text-sm font-semibold text-slate-950" onClick={() => { dispatch(logout()); navigate("/login"); }}>Logout</button></div>
  </div></header><div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 md:grid-cols-[220px_1fr]"><aside className={shellCard}><nav className="flex flex-col gap-2">{menu.map((m)=><NavLink key={m} to={`/${m}`} className={({isActive})=>`rounded px-3 py-2 text-sm ${isActive?"bg-emerald-400 font-semibold text-slate-950":"bg-slate-800 text-slate-200"}`}>{m[0].toUpperCase()+m.slice(1)}</NavLink>)}</nav></aside><main>{children}</main></div></div>;
}

function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, recent } = useSelector((s) => s.dashboard);
  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);
  const card = (t,v)=><div className={shellCard}><p className="text-sm text-slate-400">{t}</p><p className="text-2xl font-bold">{v||0}</p></div>;
  return <div className="space-y-4"><h2 className="text-2xl font-semibold">Dashboard</h2><div className="grid gap-3 md:grid-cols-3">{card("Total Proposals",stats?.total)}{card("Active Projects",stats?.activeProjects)}{card("Earnings (PKR)",stats?.earnings)}</div><div className="grid gap-3 md:grid-cols-4">{card("Pending",stats?.summary?.pending)}{card("Accepted",stats?.summary?.accepted)}{card("Rejected",stats?.summary?.rejected)}{card("Withdrawn",stats?.summary?.withdrawn)}</div><div className={shellCard}><h3 className="mb-2 font-semibold">Recent Activity</h3>{recent?.length?recent.map((r)=><p key={r._id} className="text-sm text-slate-300">{r.jobId?.title} - {r.status}</p>):<p className="text-sm text-slate-400">No recent activity</p>}</div></div>;
}

function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", bio: "", skills: [], portfolio: [] });
  const [item, setItem] = useState({ title: "", description: "", image: "" });
  const [profileFile, setProfileFile] = useState(null);
  const [portfolioFile, setPortfolioFile] = useState(null);
  const load = async () => { const { data } = await API.get("/users/me"); setProfile(data.user); };
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", profile.name || "");
    payload.append("bio", profile.bio || "");
    payload.append("skills", Array.isArray(profile.skills) ? profile.skills.join(",") : (profile.skills || ""));
    if (profileFile) payload.append("profileImage", profileFile);
    await API.put("/users/me", payload);
    setProfileFile(null);
    load();
  };
  const addItem = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("title", item.title);
    payload.append("description", item.description);
    payload.append("image", item.image || "");
    if (portfolioFile) payload.append("image", portfolioFile);
    await API.post("/users/me/portfolio", payload);
    setItem({ title: "", description: "", image: "" });
    setPortfolioFile(null);
    load();
  };
  const delItem = async (id) => { await API.delete(`/users/me/portfolio/${id}`); load(); };
  return <div className="space-y-4"><h2 className="text-2xl font-semibold">Profile & Portfolio</h2><form className={shellCard} onSubmit={save}><div className="grid gap-2 md:grid-cols-2"><input className="rounded bg-slate-800 p-2" value={profile.name||""} onChange={(e)=>setProfile({...profile,name:e.target.value})} placeholder="Name" /><input className="rounded bg-slate-800 p-2" value={Array.isArray(profile.skills)?profile.skills.join(","):profile.skills||""} onChange={(e)=>setProfile({...profile,skills:e.target.value})} placeholder="Skills" /></div><textarea className="mt-2 w-full rounded bg-slate-800 p-2" rows={3} value={profile.bio||""} onChange={(e)=>setProfile({...profile,bio:e.target.value})} placeholder="Bio" /><input className="mt-2 w-full rounded bg-slate-800 p-2" type="file" accept="image/*" onChange={(e)=>setProfileFile(e.target.files?.[0] || null)} /><button className="mt-2 rounded bg-emerald-400 px-3 py-1.5 text-slate-950">Save</button></form><form className={shellCard} onSubmit={addItem}><h3 className="mb-2 font-semibold">Add Portfolio Item</h3><div className="grid gap-2 md:grid-cols-3"><input className="rounded bg-slate-800 p-2" placeholder="Title" value={item.title} onChange={(e)=>setItem({...item,title:e.target.value})} required /><input className="rounded bg-slate-800 p-2" placeholder="Description" value={item.description} onChange={(e)=>setItem({...item,description:e.target.value})} required /><input className="rounded bg-slate-800 p-2" placeholder="Image URL (optional)" value={item.image} onChange={(e)=>setItem({...item,image:e.target.value})} /></div><input className="mt-2 w-full rounded bg-slate-800 p-2" type="file" accept="image/*" onChange={(e)=>setPortfolioFile(e.target.files?.[0] || null)} /><button className="mt-2 rounded bg-emerald-400 px-3 py-1.5 text-slate-950">Add</button></form><div className="grid gap-3 md:grid-cols-2">{profile.portfolio?.map((p)=><div className={shellCard} key={p._id}>{p.image&&<img src={p.image} alt={p.title} className="mb-2 h-36 w-full rounded object-cover" />}<p className="font-semibold">{p.title}</p><p className="text-sm text-slate-400">{p.description}</p><button className="mt-2 rounded border border-red-500 px-2 py-1 text-xs text-red-400" onClick={()=>delItem(p._id)}>Delete</button></div>)}</div></div>;
}

function JobsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.jobs);
  const rates = useSelector((s) => s.currency.rates);
  const [filters, setFilters] = useState({ search: "", min: "", max: "", category: "", sort: "latest" });
  const [skillInput, setSkillInput] = useState("");
  const [recommended, setRecommended] = useState([]);
  useEffect(() => { dispatch(fetchJobs(filters)); dispatch(fetchRates()); }, [dispatch, filters]);
  const getRecommendations = async () => {
    if (!skillInput.trim()) return;
    const { data } = await API.post("/jobs/recommendations", { skills: skillInput });
    setRecommended(data.jobs || []);
  };
  const apply = (jobId) => {
    const coverLetter = window.prompt("Cover letter");
    const bidAmount = window.prompt("Bid amount in PKR");
    if (coverLetter && bidAmount) dispatch(submitProposal({ jobId, coverLetter, bidAmount: Number(bidAmount) }));
  };
  return <div className="space-y-4"><h2 className="text-2xl font-semibold">Browse Jobs</h2><div className={shellCard}><p className="mb-2 text-sm text-slate-300">AI Job Recommendations (Gemini)</p><div className="flex gap-2"><input className="flex-1 rounded bg-slate-800 p-2" value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} placeholder="Enter skills, e.g. React, Node.js"/><button className="rounded bg-indigo-400 px-3 py-2 text-sm font-semibold text-slate-950" onClick={getRecommendations}>Recommend</button></div>{recommended.length>0&&<div className="mt-3 space-y-2">{recommended.map((j)=><div key={`rec-${j._id}`} className="rounded bg-slate-800 p-2 text-sm"><span className="font-semibold">{j.title}</span> <span className="text-slate-400">({j.category})</span></div>)}</div>}</div><div className="grid gap-2 md:grid-cols-5"><input className="rounded bg-slate-800 p-2" placeholder="Search" onChange={(e)=>setFilters({...filters,search:e.target.value})}/><input className="rounded bg-slate-800 p-2" placeholder="Min" onChange={(e)=>setFilters({...filters,min:e.target.value})}/><input className="rounded bg-slate-800 p-2" placeholder="Max" onChange={(e)=>setFilters({...filters,max:e.target.value})}/><select className="rounded bg-slate-800 p-2" onChange={(e)=>setFilters({...filters,category:e.target.value})}><option value="">All</option><option>Design</option><option>Development</option><option>Writing</option></select><select className="rounded bg-slate-800 p-2" onChange={(e)=>setFilters({...filters,sort:e.target.value})}><option value="latest">Latest</option><option value="highest">Highest Budget</option></select></div>{items.map((j)=><div key={j._id} className={shellCard}><p className="text-lg font-semibold">{j.title}</p><p className="text-sm text-slate-400">{j.description}</p><p className="mt-1 text-sm">PKR {j.budget} {rates?.PKR_TO_USD?`(~USD ${(j.budget*rates.PKR_TO_USD).toFixed(2)})`:""}</p><p className="text-xs text-slate-500">{j.category} | {j.skillsRequired?.join(", ")}</p><button onClick={()=>apply(j._id)} className="mt-2 rounded bg-emerald-400 px-3 py-1.5 text-sm font-semibold text-slate-950">Submit Proposal</button></div>)}</div>;
}

function ProposalsPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.proposals);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ coverLetter: "", bidAmount: "" });
  useEffect(() => { dispatch(fetchMyProposals()); }, [dispatch]);
  const start = (p) => { setEditId(p._id); setForm({ coverLetter: p.coverLetter, bidAmount: p.bidAmount }); };
  const save = () => { dispatch(editProposal({ id: editId, coverLetter: form.coverLetter, bidAmount: Number(form.bidAmount) })); setEditId(null); };
  return <div className="space-y-3"><h2 className="text-2xl font-semibold">Proposal Management</h2>{items.map((p)=><div key={p._id} className={shellCard}><p className="font-semibold">{p.jobId?.title}</p><p className="text-sm">Status: <span className="text-emerald-400">{p.status}</span></p><p className="text-sm text-slate-300">Bid: PKR {p.bidAmount}</p><p className="text-sm text-slate-400">{p.coverLetter}</p><div className="mt-2 flex gap-2">{p.status==="pending"&&<button className="rounded border border-slate-500 px-2 py-1 text-xs" onClick={()=>start(p)}>Edit</button>}{p.status!=="withdrawn"&&<button className="rounded border border-red-500 px-2 py-1 text-xs text-red-400" onClick={()=>dispatch(withdrawProposal(p._id))}>Withdraw</button>}</div></div>)}{editId&&<div className={shellCard}><textarea className="mb-2 w-full rounded bg-slate-800 p-2" value={form.coverLetter} onChange={(e)=>setForm({...form,coverLetter:e.target.value})}/><input className="mb-2 w-full rounded bg-slate-800 p-2" value={form.bidAmount} onChange={(e)=>setForm({...form,bidAmount:e.target.value})}/><button className="rounded bg-emerald-400 px-3 py-1.5 text-slate-950" onClick={save}>Save Changes</button></div>}</div>;
}

function ChatPage() {
  const user = useSelector((s) => s.auth.user);
  const [clientId, setClientId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [reporting, setReporting] = useState(false);
  useEffect(() => {
    if (!user?._id) return;
    const token = localStorage.getItem("token");
    socket.auth = { token };
    socket.connect();
    socket.emit("join", { userId: user._id });
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
    return () => { socket.off("receiveMessage"); socket.disconnect(); };
  }, [user]);
  const load = async () => { const { data } = await API.get(`/chat/${clientId}`); setMessages(data.messages); };
  const send = () => { if (text && clientId) { socket.emit("sendMessage", { receiverId: clientId, text }); setText(""); } };
  const reportClient = async () => {
    if (!clientId) return;
    const reason = window.prompt("Enter report reason");
    if (!reason) return;
    try {
      setReporting(true);
      await API.post("/reports", { reportedUser: clientId, reason });
      window.alert("Report submitted successfully.");
    } catch (error) {
      window.alert(error?.response?.data?.message || "Failed to submit report.");
    } finally {
      setReporting(false);
    }
  };
  const sorted = useMemo(() => messages.slice().sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)), [messages]);
  return <div className={shellCard}><h2 className="mb-3 text-2xl font-semibold">Real-time Chat</h2><div className="mb-3 flex gap-2"><input className="flex-1 rounded bg-slate-800 p-2" value={clientId} onChange={(e)=>setClientId(e.target.value)} placeholder="Client user ID"/><button className="rounded bg-slate-700 px-3" onClick={load}>Load</button><button className="rounded bg-red-500/80 px-3 text-sm text-white" disabled={reporting || !clientId} onClick={reportClient}>{reporting ? "Reporting..." : "Report Client"}</button></div><div className="mb-3 h-72 overflow-auto rounded bg-slate-950 p-3">{sorted.map((m)=><div key={m._id||`${m.createdAt}-${m.text}`} className={`mb-2 max-w-[80%] rounded p-2 text-sm ${String(m.senderId)===String(user._id)?"ml-auto bg-emerald-400 text-slate-950":"bg-slate-800"}`}><div>{m.text}</div><div className="text-[10px] opacity-70">{new Date(m.createdAt||Date.now()).toLocaleString()}</div></div>)}</div><div className="flex gap-2"><input className="flex-1 rounded bg-slate-800 p-2" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type message"/><button className="rounded bg-emerald-400 px-4 text-slate-950" onClick={send}>Send</button></div></div>;
}

function Screen({ children }) { return <Protected><Layout>{children}</Layout></Protected>; }

function AppShell() {
  return <BrowserRouter><Routes>
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route path="/dashboard" element={<Screen><DashboardPage /></Screen>} />
    <Route path="/profile" element={<Screen><ProfilePage /></Screen>} />
    <Route path="/jobs" element={<Screen><JobsPage /></Screen>} />
    <Route path="/proposals" element={<Screen><ProposalsPage /></Screen>} />
    <Route path="/chat" element={<Screen><ChatPage /></Screen>} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes></BrowserRouter>;
}

export default function App() {
  return <Provider store={store}><AppShell /></Provider>;
}
