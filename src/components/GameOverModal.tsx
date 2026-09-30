import React from 'react';
import { Skull, RotateCcw, Sparkles } from 'lucide-react';
import { FighterCustomization, SurvivalStats } from '../types/game';

interface GameOverModalProps {
  customization: FighterCustomization;
  stats: SurvivalStats;
  onRetry: () => void;
  onCustomize: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  customization,
  stats,
  onRetry,
  onCustomize,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl p-6 text-center flex flex-col items-center">
        {/* Skull Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30 mb-4 animate-pulse">
          <Skull className="w-10 h-10 text-rose-400" />
        </div>

        <h2 className="font-action text-5xl text-rose-500 font-extrabold tracking-wider leading-none mb-1">
          YOU WERE OVERWHELMED!
        </h2>
        <p className="text-sm text-slate-300 mb-5">
          <strong className="text-sky-400">{customization.heroName}</strong> fell on the midnight street, but fought with unmatched courage!
        </p>

        {/* Stats Grid matching reference image counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mb-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Zombies Eliminated
            </span>
            <span className="font-action text-3xl font-extrabold text-white tabular-nums">
              {stats.totalKills}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Max Kill Combo
            </span>
            <span className="font-action text-3xl font-extrabold text-rose-500 tabular-nums">
              {stats.maxCombo}x
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Survival Score
            </span>
            <span className="font-action text-3xl font-extrabold text-amber-400 tabular-nums">
              {stats.score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onCustomize}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Switch Photos
          </button>

          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-action text-xl font-bold tracking-wider transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            SURVIVE AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};
