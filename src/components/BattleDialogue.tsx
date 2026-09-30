import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DialogueEvent {
  id: number;
  speaker: 'HERO' | 'ENEMY';
  text: string;
  avatar: string;
  name: string;
}

interface BattleDialogueProps {
  dialogue: DialogueEvent | null;
}

export const BattleDialogue: React.FC<BattleDialogueProps> = ({ dialogue }) => {
  return (
    <AnimatePresence>
      {dialogue && (
        <motion.div
          key={dialogue.id}
          initial={{ opacity: 0, y: dialogue.speaker === 'HERO' ? 20 : -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className={`absolute z-30 flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-xl backdrop-blur-md max-w-sm pointer-events-none ${
            dialogue.speaker === 'HERO'
              ? 'bottom-20 left-6 bg-sky-950/85 border-sky-400/60 text-sky-100'
              : 'top-20 right-6 bg-emerald-950/85 border-emerald-400/60 text-emerald-100'
          }`}
        >
          <img
            src={dialogue.avatar}
            alt={dialogue.name}
            className={`w-9 h-9 rounded-full object-cover border-2 shrink-0 ${
              dialogue.speaker === 'HERO' ? 'border-sky-400' : 'border-emerald-400'
            }`}
          />
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                dialogue.speaker === 'HERO' ? 'text-sky-300' : 'text-emerald-300'
              }`}
            >
              {dialogue.name}
            </span>
            <span className="text-xs font-medium leading-tight">
              "{dialogue.text}"
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
