"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Download,
  Calendar,
  MessageCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CTASectionProps {
  isAvailable?: boolean;
  email?: string;
  resumeUrl?: string;
  calendlyUrl?: string;
  showResumeDownload?: boolean;
  showScheduleCall?: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const CTASection: React.FC<CTASectionProps> = ({
  isAvailable = true,
  email = "huotchhayyy@gmail.com",
  resumeUrl,
  calendlyUrl,
  showResumeDownload = true,
  showScheduleCall = true,
}) => {
  const benefits = [
    "5+ years of software development experience",
    "Full-stack expertise in modern technologies",
    "Strong focus on user experience and performance",
    "Collaborative approach to problem-solving",
  ];

  return (
    <section className="portfolio-section-spacing bg-muted/30">
      <div className="portfolio-container">
        <motion.div
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Main CTA Card */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden portfolio-shadow-large border-primary/20">
              <CardContent className="p-8 lg:p-12">
                <div className="text-center space-y-6">
                  {/* Status Badge */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex justify-center"
                  >
                    <Badge
                      className={`text-sm px-4 py-2 ${
                        isAvailable
                          ? "portfolio-status-available"
                          : "portfolio-status-busy"
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
                      {isAvailable
                        ? "Available for New Projects"
                        : "Currently Engaged"}
                    </Badge>
                  </motion.div>

                  {/* Headline */}
                  <motion.div variants={fadeInUp} className="space-y-4">
                    <h2 className="portfolio-heading-2 portfolio-text-balance">
                      Ready to Build Something
                      <span className="relative inline-block ml-2">
                        Amazing
                        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-primary animate-pulse" />
                      </span>
                      ?
                    </h2>
                    <p className="portfolio-body-large max-w-2xl mx-auto portfolio-text-pretty">
                      Let&apos;s discuss your project and explore how we can
                      create exceptional digital experiences together.
                    </p>
                  </motion.div>

                  {/* Benefits */}
                  <motion.div
                    variants={fadeInUp}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto"
                  >
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-left"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="portfolio-body-small text-foreground">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Primary CTA Buttons */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
                  >
                    <Link href={`mailto:${email}`}>
                      <Button
                        size="lg"
                        className="group portfolio-button-primary px-8 py-3 text-base font-semibold"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Get In Touch
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>

                    {showScheduleCall && calendlyUrl && (
                      <Link
                        href={calendlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="group portfolio-button-outline px-8 py-3 text-base font-semibold"
                        >
                          <Calendar className="w-5 h-5 mr-2" />
                          Schedule a Call
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    )}
                  </motion.div>

                  {/* Secondary Actions */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 border-t border-border/50"
                  >
                    {showResumeDownload && resumeUrl && (
                      <Link
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" className="group text-sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                          <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    )}

                    <Link href="#projects">
                      <Button variant="ghost" className="group text-sm">
                        View My Work
                        <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>

                    <Link href="#recommendations">
                      <Button variant="ghost" className="group text-sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Read Testimonials
                        <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          >
            <Card className="text-center p-6 portfolio-card hover:border-primary/20 transition-colors duration-300">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="portfolio-body-small mb-3">
                For project inquiries and collaboration
              </p>
              <Link href={`mailto:${email}`}>
                <Button variant="outline" size="sm">
                  Send Email
                </Button>
              </Link>
            </Card>

            {showScheduleCall && (
              <Card className="text-center p-6 portfolio-card hover:border-primary/20 transition-colors duration-300">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Schedule Call</h3>
                <p className="portfolio-body-small mb-3">
                  Book a free consultation call
                </p>
                {calendlyUrl ? (
                  <Link href={calendlyUrl} target="_blank">
                    <Button variant="outline" size="sm">
                      Book Call
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                )}
              </Card>
            )}

            <Card className="text-center p-6 portfolio-card hover:border-primary/20 transition-colors duration-300">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quick Chat</h3>
              <p className="portfolio-body-small mb-3">
                Have a quick question?
              </p>
              <Link href={`mailto:${email}?subject=Quick Question`}>
                <Button variant="outline" size="sm">
                  Ask Question
                </Button>
              </Link>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
