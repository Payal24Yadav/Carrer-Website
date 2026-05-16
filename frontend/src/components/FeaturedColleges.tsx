"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Star, ArrowRight, UserCheck } from "lucide-react";
import { getCollegesAPI } from "@/services/api";

interface College {
  _id: string;
  name: string;
  slug: string;
  fees: string;
  rating: number;
  placementPercentage: number;
  city: string;
  state: string;
  ownershipType: string;
  courses: { name: string }[];
  shortDescription: string;
}

export default function FeaturedColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await getCollegesAPI("limit=3&featured=true");
        setColleges(data.data);
      } catch {
        setColleges([]);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Top Colleges</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy">
              Featured <span className="gradient-text">Colleges</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-lg">Top-rated institutions for your academic journey.</p>
          </div>
          <Link href="/colleges" className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            View All Colleges <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden p-6 border border-gray-100 animate-pulse">
                <div className="h-4 w-1/4 bg-gray-100 rounded mb-4" />
                <div className="h-6 w-3/4 bg-gray-100 rounded mb-4" />
                <div className="h-4 w-1/2 bg-gray-100 rounded mb-8" />
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="h-12 bg-gray-50 rounded-xl" />
                  <div className="h-12 bg-gray-50 rounded-xl" />
                </div>
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {colleges.map((college) => (
              <div
                key={college._id}
                className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {college.ownershipType}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded-lg text-sm">
                    <Star className="w-4 h-4 fill-current" /> {college.rating}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-navy group-hover:text-primary transition-colors mb-2">
                  {college.name}
                </h3>
                
                <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-6">
                  <MapPin className="w-4 h-4" /> {college.city}, {college.state}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Average Fees</div>
                    <div className="text-navy font-bold text-sm">{college.fees}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl text-center">
                    <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Placement</div>
                    <div className="text-green-600 font-bold text-sm">{college.placementPercentage}%</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {college.courses?.slice(0, 3).map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-lg">
                      {typeof c === 'string' ? c : c.name}
                    </span>
                  ))}
                </div>

                <Link 
                  href={`/colleges/${college.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-navy text-white font-bold rounded-2xl hover:bg-primary transition-all shadow-lg shadow-navy/10"
                >
                  <UserCheck className="w-5 h-5" /> View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
