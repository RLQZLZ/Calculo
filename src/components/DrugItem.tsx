import React, { useRef, useState } from 'react';
import { Drug } from '../types';
import { CATS } from '../data/drugs';

interface DrugItemProps {
  drug: Drug;
  onOpen: () => void;
  actionType?: 'fav' | 'del';
  onAction?: () => void;
}

export const DrugItem: React.FC<DrugItemProps> = ({ drug, onOpen, actionType, onAction }) => {
  const [offset, setOffset] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const directionLock = useRef<'x' | 'y' | null>(null);

  const buttonWidth = 104;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX.current = e.clientX;
    startY.current = e.clientY;
    isDragging.current = true;
    directionLock.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !actionType) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (directionLock.current === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      directionLock.current = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (directionLock.current === 'y') {
      isDragging.current = false;
      return;
    }

    // Dragging horizontally
    const baseOffset = isOpen ? -buttonWidth : 0;
    const nextOffset = Math.max(-buttonWidth, Math.min(0, baseOffset + dx));
    setOffset(nextOffset);
  };

  const handlePointerUp = () => {
    if (!isDragging.current || !actionType) return;
    isDragging.current = false;
    if (directionLock.current === 'x') {
      if (offset < -buttonWidth / 2.5) {
        setOffset(-buttonWidth);
        setIsOpen(true);
      } else {
        setOffset(0);
        setIsOpen(false);
      }
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAction) {
      onAction();
    }
    setOffset(0);
    setIsOpen(false);
  };

  const handleClickItem = (e: React.MouseEvent) => {
    if (isOpen) {
      e.stopPropagation();
      setOffset(0);
      setIsOpen(false);
      return;
    }
    onOpen();
  };

  return (
    <div
      className="relative overflow-hidden border-b transition-colors select-none"
      style={{ borderColor: 'var(--line)' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background action button (Quitar / Eliminar) */}
      {actionType && (
        <button
          onClick={handleActionClick}
          className="absolute top-0 right-0 bottom-0 flex items-center justify-center font-bold text-[14px] text-white cursor-pointer z-0 transition-opacity"
          style={{
            width: `${buttonWidth}px`,
            background: 'var(--bad)',
            opacity: offset < -10 || isOpen ? 1 : 0,
          }}
        >
          {actionType === 'fav' ? 'Quitar' : 'Eliminar'}
        </button>
      )}

      {/* Foreground card */}
      <div
        onClick={handleClickItem}
        className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer relative z-10 transition-transform active:brightness-95"
        style={{
          background: 'var(--card)',
          transform: `translateX(${offset}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div className="flex-1 min-w-0">
          <b
            className="font-semibold block overflow-hidden text-ellipsis whitespace-nowrap text-[15px]"
            style={{ color: 'var(--txt)' }}
          >
            {drug.n}
          </b>
          <small className="text-[12px] block" style={{ color: 'var(--dim)' }}>
            {CATS[drug.c] || ''}
          </small>
        </div>

        {drug.inf && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(56,189,248,0.16)', color: 'var(--acc)' }}
          >
            inf
          </span>
        )}

        {drug.bol && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(52,211,153,0.16)', color: 'var(--ok)' }}
          >
            bolo
          </span>
        )}

        {Boolean(drug.alerta) && (
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(248,113,113,0.16)', color: 'var(--bad)' }}
          >
            !
          </span>
        )}

        <span className="text-[18px] select-none" style={{ color: 'var(--dim)' }}>
          ›
        </span>
      </div>
    </div>
  );
};
