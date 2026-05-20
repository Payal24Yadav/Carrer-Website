"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMockTestBySlugAPI, getQuestionsForTestAPI, submitMockTestAttemptAPI } from "@/services/api";
import QuestionCard from "@/components/mock-test/QuestionCard";
import QuestionPalette from "@/components/mock-test/QuestionPalette";
import ResultCard from "@/components/mock-test/ResultCard";
import Timer from "@/components/mock-test/Timer";

type Question = {
  _id: string;
  question: string;
  options: string[];
  section?: string;
  marks?: number;
  negativeMarks?: number;
};

type MockTest = {
  _id: string;
  title: string;
  slug: string;
  duration?: number;
  totalMarks?: number;
  instructions?: string;
};

type TestUser = {
  userName: string;
  email: string;
  examSlug: string;
};

type TestResult = {
  examTitle: string;
  score: number;
  totalMarks: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalQuestions: number;
  percentage: number;
};

export default function StartMockTestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mockTest, setMockTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [testUser, setTestUser] = useState<TestUser | null>(null);

  useEffect(() => {
    const savedUser = typeof window !== "undefined" ? sessionStorage.getItem("mockTestUser") : null;
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.examSlug === slug) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setTestUser(parsed);
        }
      } catch {
        setTestUser(null);
      }
    }
  }, [slug]);

  useEffect(() => {
    const loadTest = async () => {
      setLoading(true);
      try {
        const { data } = await getMockTestBySlugAPI(slug);
        const test = data.data;
        setMockTest(test);

        const questionsRes = await getQuestionsForTestAPI(test._id);
        setQuestions(questionsRes.data.data || []);
      } catch {
        toast.error("Failed to load mock test");
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [slug]);

  const answerPayload = useMemo(() => (
    questions.map((question, index) => ({
      questionId: question._id,
      selectedAnswer: answers[String(index)] ?? null,
    }))
  ), [answers, questions]);

  const submitTest = useCallback(async () => {
    if (!mockTest || submitting || result) return;

    const user = testUser || {
      userName: "Guest Student",
      email: `guest-${Date.now()}@mocktest.local`,
      examSlug: slug,
    };

    setSubmitting(true);
    try {
      const { data } = await submitMockTestAttemptAPI({
        userName: user.userName,
        email: user.email,
        examSlug: mockTest.slug,
        answers: answerPayload,
      });
      setResult(data.data);
      toast.success("Test submitted successfully");
    } catch {
      toast.error("Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  }, [answerPayload, mockTest, result, slug, submitting, testUser]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 flex flex-col items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          Loading test...
        </div>
        <Footer />
      </main>
    );
  }

  if (!mockTest) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-navy">Mock Test Not Found</h1>
          <Link href="/mock-tests" className="inline-flex mt-6 px-5 py-3 bg-primary text-white rounded-xl font-bold">Back to Mock Tests</Link>
        </div>
        <Footer />
      </main>
    );
  }

  if (result) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="pt-28 pb-16 px-4">
          <ResultCard result={result} retryHref={`/mock-tests/${mockTest.slug}`} />
        </section>
        <Footer />
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href={`/mock-tests/${mockTest.slug}`} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-3">
              <ArrowLeft className="w-4 h-4" />
              Back to details
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{mockTest.title}</h1>
            <p className="text-sm text-gray-300 mt-1">{answeredCount}/{questions.length} answered</p>
          </div>
          <Timer durationMinutes={mockTest.duration || 30} onExpire={submitTest} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mockTest.instructions && (
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-900 whitespace-pre-wrap">
            {mockTest.instructions}
          </div>
        )}

        {questions.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-navy">No questions added yet</h2>
            <p className="text-gray-500 text-sm mt-2">Please check back once the admin has published questions for this test.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            <div className="space-y-5">
              <QuestionCard
                question={currentQuestion}
                index={currentIndex}
                selectedAnswer={answers[String(currentIndex)] ?? null}
                onAnswer={(answer) => setAnswers((current) => ({ ...current, [String(currentIndex)]: answer }))}
              />

              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((current) => Math.max(0, current - 1))}
                  className="px-5 py-3 border border-gray-200 bg-white text-navy rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex gap-3">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((current) => Math.min(questions.length - 1, current + 1))}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitTest}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-70"
                    >
                      {submitting ? "Submitting..." : "Submit Test"} <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <QuestionPalette total={questions.length} currentIndex={currentIndex} answers={answers} onJump={setCurrentIndex} />
              <button
                type="button"
                onClick={submitTest}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm disabled:opacity-70"
              >
                <Flag className="w-4 h-4" />
                {submitting ? "Submitting..." : "Finish Test"}
              </button>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
