"use client";

import { Github, Linkedin, Code, Briefcase, Wrench } from "lucide-react";
import Image from "next/image";
import { teamMembers } from "../index";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                Meet the Team
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Der Entwickler hinter dieser E-Commerce Platform
            </p>
          </div>
        </div>
      </section>

      <div className="rgb-border"></div>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all group text-center lg:text-left">
              <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto lg:mx-0">
                <Code className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">
                Modern Stack
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Entwickelt mit Next.js, TypeScript und Tailwind CSS für eine
                schnelle, typsichere und ansprechende Benutzererfahrung.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all group text-center lg:text-left">
              <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto lg:mx-0">
                <Briefcase className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">
                Business Focused
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Technisches Know-how mit Geschäftssinn verbinden, um Lösungen
                mit echtem Mehrwert zu schaffen.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all group text-center lg:text-left">
              <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto lg:mx-0">
                <Wrench className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-amber-400">
                User Centric
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Reale Probleme mit praktischen Lösungen angehen, die aus der
                Perspektive des Endbenutzers entwickelt wurden.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="rgb-border"></div>

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
              Angetrieben von der Leidenschaft, außergewöhnliche digitale
              Erlebnisse zu schaffen.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              // Outer wrapper for RGB border effect
              <div
                key={index}
                className="relative rounded-3xl p-0.5 overflow-hidden group [background:linear-gradient(90deg,rgba(239,68,68,0.5),rgba(234,179,8,0.5),rgba(34,197,94,0.5),rgba(59,130,246,0.5),rgba(168,85,247,0.5),rgba(239,68,68,0.5))] bg-size-[300%_300%] animate-[rgb-border_3s_ease_infinite]"
              >
                {/* Inner Card Content */}
                <div className="bg-zinc-900 rounded-[calc(1.5rem-2px)] overflow-hidden flex flex-col min-h-[520px] h-full">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center pt-12">
                    {member.image ? (
                      <div className="relative w-48 h-48">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover rounded-full border-4 border-amber-400 shadow-lg"
                          sizes="160px"
                        />
                      </div>
                    ) : (
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <div className="w-48 h-48 bg-linear-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                          <span className="text-7xl font-bold text-black">
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
                  <div className="px-12 py-8 flex flex-col grow text-center">
                    <h3 className="text-4xl font-bold mb-2 text-amber-400 tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-xl text-gray-300 font-semibold mb-8">
                      {member.role}
                    </p>
                    <div className="flex flex-col gap-4 mb-8">
                      {member.bio.split("\n").map((para, idx) => (
                        <p
                          key={idx}
                          className="text-lg text-gray-400 leading-relaxed mx-auto"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

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
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rgb-border"></div>

      {/* Technology Stack Section */}
      <section className="py-16 px-4 bg-zinc-950">
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

      <div className="rgb-border"></div>

      {/* Contact CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Let&apos;s Connect
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 mt-15">
            Ich freue mich über jede Gelegenheit, mich zu vernetzen. Da ich
            derzeit aktiv auf der Suche nach einem Praktikum oder einer Junior
            Stelle im Bereich Software Engineering bin, bin ich besonders an
            einem Austausch über Einstiegsmöglichkeiten interessiert.
            Kontaktiere mich gerne über LinkedIn oder wirf einen Blick auf meine
            Projekte bei GitHub. Ich freue mich auf deine Nachricht!
          </p>
        </div>
      </section>
    </div>
  );
}
