import React, { useState } from 'react';
import { AppTab, AudioSample, EngineToggle } from './types';
import { INITIAL_SAMPLES, INITIAL_ENGINES, INITIAL_ANOMALIES } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { UploadScreen } from './components/UploadScreen';
import { InspectionScreen } from './components/InspectionScreen';
import { DefectReportScreen } from './components/DefectReportScreen';
import { SampleDetailInspector } from './components/SampleDetailInspector';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('upload');
  const [prevTab, setPrevTab] = useState<AppTab>('upload');
  const [samples] = useState<AudioSample[]>(INITIAL_SAMPLES);
  const [engines, setEngines] = useState<EngineToggle[]>(INITIAL_ENGINES);
  const [selectedSample, setSelectedSample] = useState<AudioSample>(INITIAL_SAMPLES[0]);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleToggleEngine = (id: string) => {
    setEngines((prev) =>
      prev.map((eng) => (eng.id === id ? { ...eng, enabled: !eng.enabled } : eng))
    );
  };

  const handleSelectAllEngines = () => {
    const allEnabled = engines.every((e) => e.enabled);
    setEngines((prev) => prev.map((eng) => ({ ...eng, enabled: !allEnabled })));
  };

  const handleOpenSampleDetail = (sample: AudioSample) => {
    setSelectedSample(sample);
    setPrevTab(currentTab === 'sample-detail' ? 'upload' : currentTab);
    setCurrentTab('sample-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: AppTab) => {
    setPrevTab(currentTab);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setCurrentTab(prevTab === 'sample-detail' ? 'inspection' : prevTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#56d5ff]/30">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onBack={handleBackFromDetail}
      />

      {/* Main Content View Container */}
      <main className="flex-1 flex flex-col w-full relative">
        {currentTab === 'upload' && (
          <UploadScreen
            samples={samples}
            engines={engines}
            onToggleEngine={handleToggleEngine}
            onSelectAllEngines={handleSelectAllEngines}
            onOpenSampleDetail={handleOpenSampleDetail}
            onStartBatch={() => handleTabChange('inspection')}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        )}

        {currentTab === 'inspection' && (
          <InspectionScreen
            samples={samples}
            anomalies={INITIAL_ANOMALIES}
            onOpenSampleDetail={handleOpenSampleDetail}
            onNavigateToReports={() => handleTabChange('reports')}
          />
        )}

        {currentTab === 'reports' && (
          <DefectReportScreen
            samples={samples}
            onOpenSampleDetail={handleOpenSampleDetail}
            onNavigateToInspect={() => handleTabChange('inspection')}
          />
        )}

        {currentTab === 'sample-detail' && (
          <SampleDetailInspector
            sample={selectedSample}
            onBack={handleBackFromDetail}
          />
        )}

        {currentTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Persistent Bottom Nav Bar (hidden in full forensic stack inspector) */}
      {currentTab !== 'sample-detail' && (
        <BottomNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          defectCount={15}
        />
      )}
    </div>
  );
}
