import { useState } from 'react';
import { SiteSelection } from '@/components/SiteSelection';
import { DepartmentSelection } from '@/components/DepartmentSelection';
import { Login } from '@/components/Login';
import { ChatInterface } from '@/components/ChatInterface';

type Step = 'site' | 'department' | 'login' | 'chat';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('site');
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleSiteSelect = (site: string) => {
    setSelectedSite(site);
    setCurrentStep('department');
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setCurrentStep('login');
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setCurrentStep('chat');
  };

  const handleLogout = () => {
    setCurrentStep('site');
    setSelectedSite('');
    setSelectedDepartment('');
    setUserEmail('');
  };

  const handleBackToSite = () => {
    setCurrentStep('site');
    setSelectedSite('');
  };

  const handleBackToDepartment = () => {
    setCurrentStep('department');
  };

  return (
    <div className="min-h-screen">
      {currentStep === 'site' && (
        <SiteSelection onSiteSelect={handleSiteSelect} />
      )}
      
      {currentStep === 'department' && (
        <DepartmentSelection 
          selectedSite={selectedSite}
          onDepartmentSelect={handleDepartmentSelect}
          onBack={handleBackToSite}
        />
      )}
      
      {currentStep === 'login' && (
        <Login 
          selectedSite={selectedSite}
          selectedDepartment={selectedDepartment}
          onLogin={handleLogin}
          onBack={handleBackToDepartment}
        />
      )}
      
      {currentStep === 'chat' && (
        <ChatInterface 
          userEmail={userEmail}
          selectedSite={selectedSite}
          selectedDepartment={selectedDepartment}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Index;
