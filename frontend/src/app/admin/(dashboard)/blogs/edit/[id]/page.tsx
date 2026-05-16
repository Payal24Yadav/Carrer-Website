"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBlogsAPI, updateBlogAPI } from "@/services/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const categories = ["MBA", "Engineering", "Medical", "Law", "Career Tips", "Exam Updates", "Study Abroad", "General"];

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ title: "", slug: "", description: "", content: "", category: "General", thumbnailUrl: "", author: "" });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await getBlogsAPI(`limit=100`);
        const blog = data.data.find((b: any) => b._id === params.id);
        if (blog) setForm({ title: blog.title, slug: blog.slug, description: blog.description, content: blog.content, category: blog.category, thumbnailUrl: blog.thumbnailUrl || "", author: blog.author });
      } catch {} finally { setFetching(false); }
    };
    fetchBlog();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await updateBlogAPI(params.id as string, form); router.push("/admin/blogs"); } catch (err: any) { alert(err.response?.data?.message || "Failed to update"); } finally { setLoading(false); }
  };

  if (fetching) return <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 skeleton-shimmer rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-navy">Edit Blog</h1>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Title *</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
          <div><label className="block text-sm font-medium text-navy mb-2">Slug *</label>
            <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
        </div>
        <div><label className="block text-sm font-medium text-navy mb-2">Description *</label>
          <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" /></div>
        <div><label className="block text-sm font-medium text-navy mb-2">Content * (HTML)</label>
          <textarea required rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none font-mono text-sm" /></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div><label className="block text-sm font-medium text-navy mb-2">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          {/* <div><label className="block text-sm font-medium text-navy mb-2">Thumbnail URL</label>
            <input value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div> */}
          <div><label className="block text-sm font-medium text-navy mb-2">Author</label>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" /></div>
        </div>
        <div className="flex justify-end gap-4">
          <Link href="/admin/blogs" className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</Link>
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"><Save className="w-4 h-4" /> {loading ? "Updating..." : "Update Blog"}</button>
        </div>
      </form>
    </div>
  );
}
