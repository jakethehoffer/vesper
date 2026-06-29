import type { Metadata } from 'next';
import Dawn from '../components/Dawn';

export const metadata: Metadata = { title: 'DAWN · VESPER' };

export default function DawnPage() {
  return (
    <article>
      <Dawn />
    </article>
  );
}
