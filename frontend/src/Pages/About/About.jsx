import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  PlusCircle,
  ListOrdered,
  ArrowUpDown,
  FileText,
  Save,
  Cpu
} from "lucide-react";
import "./HelpPage.css";

const steps = [
  {
    icon: Calendar,
    title: "Create your event",
    content:
      "Start by defining the basics — give your event a name, pick a date, and set the starting time. You can optionally define an end time, but it's not required to begin building your agenda."
  },
  {
    icon: PlusCircle,
    title: "Add agenda sections",
    content:
      "For each speaker, enter their name, talk title, and how long they need. The system automatically assigns time slots, so you never have to calculate timings manually."
  },
  {
    icon: ListOrdered,
    title: "Build your flow",
    content:
      "As you add entries, your full agenda starts taking shape. Each section fits perfectly into the timeline without overlaps or gaps."
  },
  {
    icon: ArrowUpDown,
    title: "Reorder anytime",
    content:
      "Plans change — just move items up or down. The entire schedule updates instantly, keeping everything consistent without extra effort."
  },
  {
    icon: FileText,
    title: "Add context",
    content:
      "Include a header for meeting details or notes, and a footer for closing remarks or instructions. This gives your agenda a complete, professional feel."
  },
  {
    icon: Save,
    title: "Export or save",
    content:
      "Generate a clean PDF instantly. If you log in, you can save your events and come back later to edit or reuse them."
  }
];

const StepCard = ({ step, index }) => {
  const Icon = step.icon;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="card-header">
        <div className="badge">{index + 1}</div>
        <Icon size={22} className="icon" />
      </div>

      <h3>{step.title}</h3>
      <p>{step.content}</p>
    </motion.div>
  );
};

const HelpPage = () => {
  return (
    <div className="container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Plan events without the headache
      </motion.h1>

      <p className="subtitle">
        Build structured agendas, adjust them instantly, and export clean PDFs —
        all without touching a calculator.
      </p>

      <div className="grid">
        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </div>

      <motion.div
        className="card tech"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="card-header">
          <Cpu size={20} />
          <h3>Technical Overview</h3>
        </div>

        <p>
          Built using React and Node.js, the application dynamically computes
          time slots based on duration and ordering. The scheduling engine
          ensures a continuous timeline, while PDF generation produces a clean,
          shareable agenda document.
        </p>
      </motion.div>
    </div>
  );
};

export default HelpPage;