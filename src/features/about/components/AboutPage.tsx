"use client";

import { Github, Linkedin, Code, Briefcase, Wrench } from "lucide-react";
import { teamMembers } from "../data";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                Meet the Team
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              The talented developers behind this e-commerce platform
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all group">
              <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">
                Modern Stack
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Built with Next.js, TypeScript, and Tailwind CSS for a fast,
                type-safe, and beautiful user experience.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all group">
              <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">
                Business Focused
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Understanding both technical implementation and business value
                to deliver solutions that matter.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all group">
              <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wrench className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">
                User Centric
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Solving real problems with practical solutions designed from the
                end-user perspective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                Developer
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Passionate about creating exceptional digital experiences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col"
              >
                {/* Profile Image */}
                <div className="relative h-80 bg-linear-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent group-hover:from-amber-500/20 transition-all z-10"></div>
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-linear-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                        <span className="text-5xl font-bold text-black">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="p-8 flex flex-col grow text-center">
                  <h3 className="text-2xl font-bold mb-4 text-amber-400">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 font-semibold mb-4">
                    {member.role}
                  </p>
                  {member.bio.split("\n").map((para, idx) => (
                    <p
                      key={idx}
                      className="text-gray-400 leading-relaxed mb-4 text-sm last:mb-0 grow"
                    >
                      {para}
                    </p>
                  ))}

                  {/* Social Links */}
                  <div className="flex gap-4 mt-auto">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-amber-500 hover:bg-zinc-750 transition-all group/link"
                      >
                        <Github className="w-5 h-5 text-gray-400 group-hover/link:text-amber-400 transition-colors" />
                        <span className="text-sm font-semibold text-gray-400 group-hover/link:text-amber-400 transition-colors">
                          GitHub
                        </span>
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-amber-500 hover:bg-zinc-750 transition-all group/link"
                      >
                        <Linkedin className="w-5 h-5 text-gray-400 group-hover/link:text-amber-400 transition-colors" />
                        <span className="text-sm font-semibold text-gray-400 group-hover/link:text-amber-400 transition-colors">
                          LinkedIn
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 px-4 border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Built With Modern Technologies
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Node.js",
              "MongoDB",
              "Cloudinary",
            ].map((tech, index) => (
              <span
                key={index}
                className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-amber-400 font-semibold hover:border-amber-500/50 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Let&apos;s Connect
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 mt-15">
            Feel free to reach out to any of our team members via LinkedIn or
            GitHub.
          </p>
        </div>
      </section>
    </div>
  );
}
