import React from "react";
import { GraduationCap, Briefcase, BookOpen, Globe, Award, Users, Laptop, Landmark } from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "MBA/PGDM Admission",
    description: "Strategic guidance for top-tier management programs across India.",
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Laptop,
    title: "B.Tech Admission",
    description: "Engineering admissions consulting for premier institutes like IITs and NITs.",
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-500",
  },
  {
    icon: BookOpen,
    title: "BBA/BCA Admission",
    description: "Foundation mapping for early professional undergraduate degrees.",
    color: "from-green-500/20 to-green-600/20",
    iconColor: "text-green-500",
  },
  {
    icon: Globe,
    title: "Study Abroad",
    description: "Comprehensive guidance for international university admissions.",
    color: "from-orange-500/20 to-orange-600/20",
    iconColor: "text-orange-500",
  },
  {
    icon: Briefcase,
    title: "Placement Support",
    description: "End-to-end interview prep and placement strategy for top companies.",
    color: "from-red-500/20 to-red-600/20",
    iconColor: "text-red-500",
  },
  {
    icon: Award,
    title: "Scholarship Support",
    description: "Identifying and applying for merit and need-based financial aid.",
    color: "from-yellow-500/20 to-yellow-600/20",
    iconColor: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Career Counselling",
    description: "Personalized counselling to find the right career path for you.",
    color: "from-teal-500/20 to-teal-600/20",
    iconColor: "text-teal-500",
  },
  {
    icon: Landmark,
    title: "Online Degrees",
    description: "Navigating flexible, globally recognized online education programs.",
    color: "from-indigo-500/20 to-indigo-600/20",
    iconColor: "text-indigo-500",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-navy">
            End-to-End Support for Your{" "}
            <span className="gradient-text">Education Journey</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            From admission guidance to placement support, we cover every aspect of your
            academic and professional journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${service.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
