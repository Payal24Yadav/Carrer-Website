"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import MockTestSectionBuilder, { normalizeMockTestSection } from "@/components/admin/MockTestSectionBuilder";
import { getMockTestByIdAPI, updateMockTestAPI } from "@/services/api";

export default function EditMockTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "MBA & Management",
    subtitle: "",
    badgeType: "",
    shortDescription: "",
    status: "active",
    isFeatured: false,
  });

  useEffect(() => {
    const fetchMockTest = async () => {
      try {
        const { data } = await getMockTestByIdAPI(id);
        const testData = data.data;

        setFormData({
          title: testData.title || "",
          slug: testData.slug || "",
          category: testData.category || "MBA & Management",
          subtitle: testData.subtitle || "",
          badgeType: testData.badgeType || "",
          shortDescription: testData.shortDescription || "",
          status: testData.status || "active",
          isFeatured: Boolean(testData.isFeatured),
        });

        setSections(Array.isArray(testData.sections) ? testData.sections.map(normalizeMockTestSection) : []);
      } catch {
        toast.error("Failed to load mock test details");
        router.push("/admin/mock-tests");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMockTest();
  }, [id, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateMockTestAPI(id, { ...formData, sections });
      toast.success("Mock Test updated successfully!");
      router.push("/admin/mock-tests");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update mock test");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/mock-tests" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Mock Test CMS</h1>
            <p className="text-sm text-gray-500 mt-1">Manage dynamic pages using structured content blocks</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors shadow-sm"
        >
          {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MockTestSectionBuilder sections={sections} setSections={setSections} />
        </div>

        <PageSettings formData={formData} setFormData={setFormData} handleTitleChange={handleTitleChange} />
      </div>
    </form>
  );
}

function PageSettings({
  formData,
  setFormData,
  handleTitleChange,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Page Settings</h2>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Page Title *</label>
            <input required type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none font-bold" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">URL Slug *</label>
            <input required type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none font-mono text-primary bg-gray-50" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
              <option value="MBA & Management">MBA & Management</option>
              <option value="Engineering (B.Tech)">Engineering (B.Tech)</option>
              <option value="SSC">SSC</option>
              <option value="Govt Exams">Govt Exams</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Subtitle *</label>
            <input required type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Short Description</label>
            <textarea rows={3} value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Badge</label>
              <select value={formData.badgeType} onChange={(e) => setFormData({ ...formData, badgeType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option value="">None</option>
                <option value="HOT">HOT</option>
                <option value="NEW">NEW</option>
                <option value="EXPERT">EXPERT</option>
                <option value="LATEST">LATEST</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 pt-4 border-t border-gray-100 cursor-pointer">
            <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-sm font-bold text-gray-700">Featured Test</span>
          </label>
        </div>
      </div>
    </div>
  );
}
