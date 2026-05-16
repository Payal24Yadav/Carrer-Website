"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { getBlogsAPI } from "@/services/api";
import { formatDate, truncate } from "@/lib/utils";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  author: string;
  publishedDate: string;
}

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await getBlogsAPI("limit=3");
        setBlogs(data.data);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Latest Articles</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy">
              From Our <span className="gradient-text">Blog</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg">Stay updated with the latest news on admissions, exams, and careers.</p>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            View All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="h-52 skeleton-shimmer" />
                <div className="pt-5 space-y-3">
                  <div className="h-4 w-1/3 skeleton-shimmer rounded" />
                  <div className="h-6 w-full skeleton-shimmer rounded" />
                  <div className="h-4 w-full skeleton-shimmer rounded" />
                  <div className="h-4 w-2/3 skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden">
                  {/* <div className="relative h-52 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                    {blog.thumbnailUrl ? (
                      <img
                        src={blog.thumbnailUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-bold text-primary/20">{blog.title.charAt(0)}</span>
                      </div>
                    )}
                  </div> */}
                  <div className="pt-5">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {blog.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(blog.publishedDate)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {truncate(blog.description, 120)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold mt-3 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
