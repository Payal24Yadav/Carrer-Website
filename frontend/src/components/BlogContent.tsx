"use client";
import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDate } from "@/lib/utils";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";

interface Blog { _id: string; title: string; slug: string; description: string; content: string; category: string; thumbnailUrl: string; author: string; publishedDate: string; }

export default function BlogContent({ blog }: { blog: Blog }) {
  const shareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <main>
      <Navbar />
      <article className="pt-24">
        <div className="bg-navy py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="flex items-center gap-1 text-sm text-accent"><Tag className="w-4 h-4" />{blog.category}</span>
              <span className="flex items-center gap-1 text-sm text-gray-400"><Calendar className="w-4 h-4" />{formatDate(blog.publishedDate)}</span>
              <span className="flex items-center gap-1 text-sm text-gray-400"><User className="w-4 h-4" />{blog.author}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{blog.title}</h1>
            <p className="mt-4 text-gray-400 text-lg">{blog.description}</p>
          </div>
        </div>

        {blog.thumbnailUrl && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-xl" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none prose-headings:text-navy prose-p:text-gray-600 prose-a:text-primary prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: blog.content }} />
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <Link href="/blog" className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"><ArrowLeft className="w-4 h-4" /> More Articles</Link>
            <button onClick={shareLink} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"><Share2 className="w-4 h-4" /> Share</button>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
