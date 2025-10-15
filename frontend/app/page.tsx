import { Suspense } from 'react';
import EscapeRoomEditorContent from './escape-room/page';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EscapeRoomEditorContent />
    </Suspense>
  );
}
