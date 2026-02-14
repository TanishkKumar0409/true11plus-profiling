"use client";
import React from "react";
import { motion, Variants } from "framer-motion";
import { BiPhone } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
import { LuLayoutDashboard } from "react-icons/lu";
import ContactForm from "./_contact_compoent/ContactForm";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  detail: string | undefined;
  sub: string;
  color: string;
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-(--secondary-bg) text-(--text-color) py-20 sm:px-8 px-4">
      <section className="py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-(--text-color)">
            Contact Information
          </h2>
          <p className="text-(--text-color) max-w-lg">
            Thank you for your interest in Escul. We&apos;re excited to hear
            from you and discuss your future.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <ContactCard
            icon={<BiPhone className="text-(--success)" size={28} />}
            title="Call Us"
            detail={process.env.NEXT_PUBLIC_MOBILE}
            sub="Available 24/7 for queries"
            color="bg-(--success-subtle)"
          />
          <ContactCard
            icon={<CgMail className="text-(--warning)" size={28} />}
            title="Official Email"
            detail={process.env.NEXT_PUBLIC_EMAIL}
            sub="Email us for any inquiries"
            color="bg-(--warning-subtle)"
          />
          <ContactCard
            icon={<LuLayoutDashboard className="text-(--orange)" size={28} />}
            title="Admission Apps"
            detail="www.true11plus.com"
            sub="App for more details"
            color="bg-(--orange-subtle)"
          />
        </motion.div>
      </section>

      <ContactForm />
    </div>
  );
}

function ContactCard({ icon, title, detail, sub, color }: ContactCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className="bg-(--primary-bg) p-8 rounded-custom shadow-custom flex flex-col items-center text-center group"
    >
      <div
        className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-xs text-(--text-subtle) pb-1">{sub}</p>
      <p className="font-bold text-(--text-color)">{detail}</p>
    </motion.div>
  );
}
