import React from 'react';
import { Crosshair, Bomb, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface SurvivalControlsProps {
  onMoveStart: (direction: 'left' | 'right') => void;
  onMoveEnd: (direction: 'left' | 'right') => void;
  onShootStart: () => void;
  onShootEnd: () => void;
  onNextWeapon: () => void;
  onAirstrike: () => void;
  airstrikesAvailable: number;
}

export const SurvivalControls: React.FC<SurvivalControlsProps> = ({
  onMoveStart,
  onMoveEnd,
  onShootStart,
  onShootEnd,
  onNextWeapon,
  onAirstrike,
  airstrikesAvailable,
}) => {
  return (
    <div className="md:hidden absolute inset-x-0 bottom-3 pointer-events-none z-30 flex justify-between px-3">
      {/* Left / Right Movement Buttons */}
      <div className="flex items-center gap-2 pointer-events-auto touch-none">
        <button
          onTouchStart={() => onMoveStart('left')}
          onTouchEnd={() => onMoveEnd('left')}
          onMouseDown={() => onMoveStart('left')}
          onMouseUp={() => onMoveEnd('left')}
          className="w-16 h-16 rounded-2xl bg-slate-900/80 active:bg-sky-600 border border-slate-700/80 text-white flex items-center justify-center shadow-lg active:scale-95"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>

        <button
          onTouchStart={() => onMoveStart('right')}
          onTouchEnd={() => onMoveEnd('right')}
          onMouseDown={() => onMoveStart('right')}
          onMouseUp={() => onMoveEnd('right')}
          className="w-16 h-16 rounded-2xl bg-slate-900/80 active:bg-sky-600 border border-slate-700/80 text-white flex items-center justify-center shadow-lg active:scale-95"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
      </div>

      {/* Action Buttons: Airstrike, Switch Weapon, Fire */}
      <div className="flex items-center gap-2 pointer-events-auto touch-none">
        {/* Airstrike Button */}
        <button
          onClick={onAirstrike}
          disabled={airstrikesAvailable <= 0}
          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-transform ${
            airstrikesAvailable > 0
              ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white active:scale-95 shadow-rose-600/40'
              : 'bg-slate-900/80 text-slate-600 border border-slate-800'
          }`}
        >
          <Bomb className="w-5 h-5 text-amber-300" />
          <span className="text-[9px] font-action font-bold">AIR</span>
        </button>

        {/* Switch Weapon Button */}
        <button
          onClick={onNextWeapon}
          className="w-14 h-14 rounded-2xl bg-slate-900/80 active:bg-slate-800 border border-slate-700/80 text-amber-400 flex flex-col items-center justify-center shadow-lg active:scale-95"
        >
          <RotateCw className="w-5 h-5" />
          <span className="text-[9px] font-action font-bold">SWAP</span>
        </button>

        {/* Fire Button */}
        <button
          onTouchStart={onShootStart}
          onTouchEnd={onShootEnd}
          onMouseDown={onShootStart}
          onMouseUp={onShootEnd}
          className="w-16 h-16 rounded-2xl bg-rose-600 active:bg-rose-500 text-white flex flex-col items-center justify-center shadow-xl shadow-rose-600/40 active:scale-95"
        >
          <Crosshair className="w-7 h-7" />
          <span className="text-[9px] font-extrabold tracking-wider">FIRE</span>
        </button>
      </div>
    </div>
  );
};
