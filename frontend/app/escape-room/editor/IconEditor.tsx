'use client';
import { useEffect, useRef, useState } from 'react';

interface PlacedItem {
  id: string; // unique instance id
  type: 'barrel' | 'chest' | 'key' | 'torch' | 'treasure';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
}

interface StageEditorProps {
  onSave: () => void;
  onCancel: () => void;
  onStep2?: () => void; // New prop for transitioning to Step 2
}

const ICON_SOURCES: Record<PlacedItem['type'], string> = {
  barrel: '/escape-room-misc/barrel.png',
  chest: '/escape-room-misc/chest.png',
  key: '/escape-room-misc/key.png',
  torch: '/escape-room-misc/torch.png',
  treasure: '/escape-room-misc/treasure.png',
};

const TOOLBOX_ITEMS: PlacedItem['type'][] = ['barrel', 'chest', 'key', 'torch', 'treasure'];

const STORAGE_KEY = 'escape-room:editor:layout';

export default function StageEditor({ onSave, onCancel, onStep2 }: StageEditorProps) {
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Load saved layout
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: PlacedItem[] = JSON.parse(saved);
        setItems(parsed);
      }
    } catch {}
  }, []);

  // Global mouse listeners for robust dragging
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingId || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      setItems((prev) => prev.map((it) => (it.id === draggingId ? { ...it, x: Math.max(1, Math.min(99, xPct)), y: Math.max(1, Math.min(99, yPct)) } : it)));
    };
    const handleUp = () => {
      setDraggingId(null);
      isDraggingRef.current = false;
    };
    if (draggingId) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [draggingId]);

  // Add new item at center when clicking toolbox
  const handleAddItem = (type: PlacedItem['type']) => {
    setItems((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, { id: `${type}-${Date.now()}`, type, x: 50, y: 50 }];
    });
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggingId(id);
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setItems((prev) => prev.map((it) => (it.id === draggingId ? { ...it, x: Math.max(1, Math.min(99, xPct)), y: Math.max(1, Math.min(99, yPct)) } : it)));
  };

  const handleReset = () => {
    setItems([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  // Validation function
  const validateIcons = () => {
    const chestCount = items.filter(item => item.type === 'chest').length;
    const totalCount = items.length;
    
    if (totalCount === 0) {
      return { isValid: false, message: 'Please place at least 1 icon!' };
    }
    if (chestCount !== 1) {
      return { isValid: false, message: 'You must place exactly 1 chest icon!' };
    }
    return { isValid: true, message: '' };
  };

  // Check individual requirements for dynamic styling
  const requirements = {
    hasAtLeastOne: items.length >= 1,
    hasExactlyOneChest: items.filter(item => item.type === 'chest').length === 1,
    withinMaxLimit: items.length <= 5
  };

  const handleSave = () => {
    const validation = validateIcons();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      // Mark that a room exists
      localStorage.setItem('escape-room:room:exists', 'true');
    } catch {}
    
    // Transition to Step 2 if onStep2 callback is provided
    if (onStep2) {
      onStep2();
    } else {
      onSave();
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxWidth: '1600px',
          maxHeight: '675px',
          aspectRatio: '16 / 9',
          backgroundImage: "url('/escape-room-misc/stage4-bg.png')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: '3px solid var(--border-color)',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'none' }} />

        {/* Top-middle counter */}
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 12 }}>
          <span style={{
            background: 'rgba(255,255,255,0.92)',
            color: '#dc3545',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            padding: '6px 12px',
            fontWeight: 800,
            fontSize: '13px',
            whiteSpace: 'nowrap'
          }}>
            Icons placed ({Math.min(items.length, 5)}/5)
          </span>
        </div>

        {/* Floating toolbox */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(255,255,255,0.9)',
          border: '2px solid var(--border-color)',
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 11,
          maxWidth: '300px'
        }}>
          <div style={{ fontWeight: 800, fontSize: '14px' }}>Step 1 - Click and drag icons to place in your escape room!</div>
          
          {/* Constraints */}
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 600,
            backgroundColor: '#fff8d1',
            border: '1px solid #ffe58f',
            borderRadius: '6px',
            padding: '6px 8px',
            marginTop: '4px'
          }}>
            <div style={{ color: '#dc3545' }}>📋 Requirements:</div>
            <div style={{ color: requirements.hasAtLeastOne ? '#28a745' : '#dc3545' }}>
              • Place at least 1 icon
            </div>
            <div style={{ color: requirements.hasExactlyOneChest ? '#28a745' : '#dc3545' }}>
              • Place exactly 1 chest icon
            </div>
            <div style={{ color: requirements.withinMaxLimit ? '#28a745' : '#dc3545' }}>
              • Maximum 5 icons total
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {TOOLBOX_ITEMS.map((t) => {
              const atLimit = items.length >= 5;
              return (
                <button
                  key={t}
                  onClick={() => handleAddItem(t)}
                  title={t}
                  disabled={atLimit}
                  style={{
                    width: '44px', height: '44px',
                    background: 'transparent', border: 'none', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: atLimit ? 'not-allowed' : 'pointer',
                    opacity: atLimit ? 0.5 : 1
                  }}
                >
                  <img src={ICON_SOURCES[t]} alt={t} width={44} height={44} draggable={false} onDragStart={(e) => e.preventDefault()} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset / Save controls */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 11 }}>
          <button
            onClick={handleReset}
            className="btn btn-outline-secondary"
            style={{
              backgroundColor: '#ffffff',
              color: '#000',
              borderColor: 'var(--border-color)',
              borderWidth: '2px',
              padding: '10px 18px',
              fontSize: '15px'
            }}
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="btn btn-success"
            style={{ padding: '10px 18px', fontSize: '15px' }}
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="btn btn-outline-secondary"
            style={{
              backgroundColor: '#ffffff',
              color: '#000',
              borderColor: 'var(--border-color)',
              borderWidth: '2px',
              padding: '10px 18px',
              fontSize: '15px'
            }}
          >
            Cancel
          </button>
        </div>

        {/* Placed items */}
        {items.map((it) => (
          <div
            key={it.id}
            style={{
              position: 'absolute',
              left: `${it.x}%`,
              top: `${it.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '56px',
              height: '56px',
              zIndex: 10
            }}
          >
            <img
              src={ICON_SOURCES[it.type]}
              alt={it.type}
              onMouseDown={(e) => handleMouseDown(e, it.id)}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              style={{
                position: 'absolute',
                inset: 0,
                margin: 'auto',
                width: '56px',
                height: '56px',
                cursor: draggingId === it.id ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setItems((prev) => prev.filter((x) => x.id !== it.id));
              }}
              title="Delete"
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              <img src="/escape-room-misc/delete.png" alt="delete" width={20} height={20} draggable={false} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
