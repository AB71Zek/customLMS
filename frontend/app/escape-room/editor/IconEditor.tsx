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

export default function StageEditor({ onSave, onCancel }: StageEditorProps) {
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
    setItems((prev) => [
      ...prev,
      { id: `${type}-${Date.now()}`, type, x: 50, y: 50 },
    ]);
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

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      // Mark that a room exists
      localStorage.setItem('escape-room:room:exists', 'true');
    } catch {}
    onSave();
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
          backgroundSize: '89.8vw 89.6vh',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: '3px solid var(--border-color)',
          borderRadius: '8px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', pointerEvents: 'none' }} />

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
          zIndex: 11
        }}>
          <div style={{ fontWeight: 800, fontSize: '14px' }}>Step 1 - Drag and drop icons to your escape room</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {TOOLBOX_ITEMS.map((t) => (
              <button
                key={t}
                onClick={() => handleAddItem(t)}
                title={t}
                style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: '#fff', border: '2px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <img src={ICON_SOURCES[t]} alt={t} width={28} height={28} draggable={false} onDragStart={(e) => e.preventDefault()} />
              </button>
            ))}
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
              borderWidth: '2px'
            }}
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="btn er-btn-primary"
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              if (!el.dataset.originalAccent) {
                el.dataset.originalAccent = getComputedStyle(el).getPropertyValue('--accent-color') || '#dc3545';
              }
              el.style.setProperty('--accent-color', '#66d29a');
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              const original = el.dataset.originalAccent || '#dc3545';
              el.style.setProperty('--accent-color', original);
            }}
            onMouseDown={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.setProperty('--accent-color', '#1e7e34');
            }}
            onMouseUp={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.setProperty('--accent-color', '#66d29a');
            }}
            style={{ color: '#fff' }}
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
              borderWidth: '2px'
            }}
          >
            Cancel
          </button>
        </div>

        {/* Placed items */}
        {items.map((it) => (
          <img
            key={it.id}
            src={ICON_SOURCES[it.type]}
            alt={it.type}
            onMouseDown={(e) => handleMouseDown(e, it.id)}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{
              position: 'absolute',
              left: `${it.x}%`,
              top: `${it.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '56px',
              height: '56px',
              cursor: draggingId === it.id ? 'grabbing' : 'grab',
              userSelect: 'none',
              zIndex: 10
            }}
          />
        ))}
      </div>
    </div>
  );
}
