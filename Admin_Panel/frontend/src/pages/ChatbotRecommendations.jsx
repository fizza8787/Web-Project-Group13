import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatbotRecommendations } from "../store/slices/adminSlice";

const ChatbotRecommendations = () => {
  const dispatch = useDispatch();
  const { chatbot, isLoading } = useSelector((state) => state.admin);
  const [skills, setSkills] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!skills.trim()) return;
    dispatch(getChatbotRecommendations(skills));
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="text-lg font-semibold text-white">Freelancer Job Recommendation Chatbot</h3>
      <p className="mt-1 text-sm text-slate-400">
        Enter freelancer skills to get matched jobs. Gemini response is used when API key is configured.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 md:flex-row">
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Example: React, Node.js, UI/UX"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? "Finding..." : "Recommend Jobs"}
        </button>
      </form>

      <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">
        <p className="text-sm whitespace-pre-wrap text-slate-300">{chatbot.botMessage || "No recommendations yet."}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {chatbot.recommendations.map((job) => (
          <article key={job.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <h4 className="font-semibold text-white">{job.title}</h4>
            <p className="mt-1 text-xs text-slate-400">Category: {job.category}</p>
            <p className="text-xs text-slate-400">
              Budget: PKR {Number(job.budgetPKR || 0).toLocaleString()} | USD{" "}
              {Number(job.budgetUSD || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="mt-2 text-xs text-slate-300">Skills: {(job.skillsRequired || []).join(", ") || "N/A"}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ChatbotRecommendations;
