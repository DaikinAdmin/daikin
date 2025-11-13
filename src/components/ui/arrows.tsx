import { Icon } from '@iconify-icon/react';

export function ArrowLeft() {
  return (
    <div className="w-10 h-10 bg-white/30 hover:bg-white rounded-full relative transition-colors duration-200">
      <span className="absolute inset-0 flex items-center justify-center">
        <Icon icon="hugeicons:arrow-left-01" className="text-xl text-black" />
      </span>
    </div>
  );
}

export function ArrowRight() {
  return (
    <div className="w-10 h-10 bg-white/30 hover:bg-white rounded-full relative transition-colors duration-200">
      <span className="absolute inset-0 flex items-center justify-center">
        <Icon icon="hugeicons:arrow-right-01" className="text-xl text-black" />
      </span>
    </div>
  );
}