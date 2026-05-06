import SimulatorEngine from '@/components/simulator/SimulatorEngine';

export const metadata = {
  title: 'Simulation — First, Do No Harm',
  description:
    'Navigate six high-pressure decisions as a hospital administrator deploying an AI diagnostic tool with known equity gaps.',
};

export default function SimulatorPage() {
  return <SimulatorEngine />;
}
