"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Edit2, Plus, Save, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { createQuestionAPI, deleteQuestionAPI, getMockTestsAPI, getQuestionsAPI, updateQuestionAPI } from "@/services/api";

const emptyForm = {
  mockTestId: "",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  section: "General",
  marks: 1,
  negativeMarks: 0,
};

export default function MockTestQuestionsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [loading, setLoading] = useState(true);

  const loadTests = async () => {
    const { data } = await getMockTestsAPI("admin=true");
    const list = data.data || [];
    setTests(list);
    if (!selectedTest && list[0]?._id) {
      setSelectedTest(list[0]._id);
      setForm((current: any) => ({ ...current, mockTestId: list[0]._id }));
    }
  };

  const loadQuestions = async (testId = selectedTest) => {
    if (!testId) return;
    setLoading(true);
    try {
      const { data } = await getQuestionsAPI(`mockTestId=${testId}`);
      setQuestions(data.data || []);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTests().catch(() => toast.error("Failed to load mock tests"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTest) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((current: any) => ({ ...current, mockTestId: selectedTest }));
      loadQuestions(selectedTest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTest]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, mockTestId: selectedTest });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      correctAnswer: Number(form.correctAnswer),
      marks: Number(form.marks),
      negativeMarks: Number(form.negativeMarks),
    };

    try {
      if (editingId) await updateQuestionAPI(editingId, payload);
      else await createQuestionAPI(payload);
      toast.success(editingId ? "Question updated" : "Question added");
      resetForm();
      loadQuestions(selectedTest);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save question");
    }
  };

  const editQuestion = (question: any) => {
    setEditingId(question._id);
    setForm({
      mockTestId: question.mockTestId?._id || question.mockTestId,
      question: question.question || "",
      options: Array.isArray(question.options) ? question.options : ["", "", "", ""],
      correctAnswer: question.correctAnswer || 0,
      explanation: question.explanation || "",
      section: question.section || "General",
      marks: question.marks ?? 1,
      negativeMarks: question.negativeMarks ?? 0,
    });
  };

  const removeQuestion = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await deleteQuestionAPI(id);
      toast.success("Question deleted");
      loadQuestions(selectedTest);
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const filteredQuestions = questions.filter((question) => (
    question.question.toLowerCase().includes(search.toLowerCase()) ||
    question.section.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Question Builder</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage MCQs for mock tests.</p>
        </div>
        <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
          {tests.map((test) => <option key={test._id} value={test._id}>{test.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <label className="relative block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
            </label>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? <div className="p-8 text-center text-gray-500">Loading questions...</div> :
              filteredQuestions.length === 0 ? <div className="p-8 text-center text-gray-500">No questions yet</div> :
              filteredQuestions.map((question, index) => (
                <div key={question._id} className="p-5 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">Q{index + 1}</span>
                        <span className="text-xs text-gray-500">{question.section}</span>
                        <span className="text-xs text-gray-500">{question.marks} marks</span>
                      </div>
                      <h3 className="font-semibold text-navy text-sm leading-relaxed">{question.question}</h3>
                      <p className="text-xs text-gray-500 mt-2">Answer: {question.options?.[question.correctAnswer]}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editQuestion(question)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" aria-label="Edit question"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => removeQuestion(question._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" aria-label="Delete question"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-navy">{editingId ? "Edit Question" : "Add Question"}</h2>
            {editingId && <button type="button" onClick={resetForm} className="p-2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
          </div>

          <textarea required rows={4} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question text" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none" />

          <div className="space-y-2">
            {form.options.map((option: string, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <input type="radio" name="correctAnswer" checked={Number(form.correctAnswer) === index} onChange={() => setForm({ ...form, correctAnswer: index })} className="w-4 h-4 text-primary" />
                <input required value={option} onChange={(e) => setForm({ ...form, options: form.options.map((item: string, i: number) => i === index ? e.target.value : item) })} placeholder={`Option ${index + 1}`} className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} placeholder="Section" className="px-3 py-2 border border-gray-200 rounded-xl text-sm" />
            <input type="number" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} placeholder="Marks" className="px-3 py-2 border border-gray-200 rounded-xl text-sm" />
            <input type="number" step="0.25" value={form.negativeMarks} onChange={(e) => setForm({ ...form, negativeMarks: e.target.value })} placeholder="Negative" className="px-3 py-2 border border-gray-200 rounded-xl text-sm" />
          </div>

          <textarea rows={3} value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} placeholder="Explanation" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm resize-none" />

          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90">
            {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? "Save Question" : "Add Question"}
          </button>
        </form>
      </div>
    </div>
  );
}
