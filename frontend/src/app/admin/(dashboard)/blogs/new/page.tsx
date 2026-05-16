"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogAPI } from "@/services/api";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const categories = ["MBA", "Engineering", "Medical", "Law", "Career Tips", "Exam Updates", "Study Abroad", "General"];

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", content: "", category: "General", thumbnailUrl: "", author: "Admin" });

  const handleTitleChange = (title: string) => { setForm({ ...form, title, slug: slugify(title) }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await createBlogAPI(form); router.push("/admin/blogs"); } catch (err: any) { alert(err.response?.data?.message || "Failed to create blog"); } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy">Add New Blog</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Title *</label>
            <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="Blog title" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Slug *</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="blog-slug" /></div>
        </div>
        <div><label className="block text-sm font-medium text-navy mb-2">Description *</label>
          <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" placeholder="Short description" /></div>
        <div><label className="block text-sm font-medium text-navy mb-2">Content * (HTML supported)</label>
          <textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none font-mono text-sm" placeholder="<h2>Blog content...</h2>" /></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Category *</label>
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></div>
          {/* <div><label className="block text-sm font-medium text-navy mb-2">Thumbnail URL</label>
            <input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" placeholder="https://..." /></div> */}
          <div><label className="block text-sm font-medium text-navy mb-2">Author</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
        </div>
        <div className="flex justify-end gap-4">
          <Link href="/admin/blogs" className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"><Save className="w-4 h-4" /> {loading ? "Creating..." : "Create Blog"}</button>
        </div>
      </form>
    </div>
  );
}
