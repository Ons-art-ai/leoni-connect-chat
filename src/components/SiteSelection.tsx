import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import logoImage from '/lovable-uploads/14cd5539-4024-49ac-a0f3-22b6f193d738.png';

interface SiteSelectionProps {
  onSiteSelect: (site: string) => void;
}

const sites = [
  'Mateur Nord',
  'Mateur Sud', 
  'Manzel Hayet',
  'Sidi Bou Ali',
  'Messadine Sousse'
];

export const SiteSelection = ({ onSiteSelect }: SiteSelectionProps) => {
  const [selectedSite, setSelectedSite] = useState<string>('');

  const handleSiteClick = (site: string) => {
    setSelectedSite(site);
  };

  const handleContinue = () => {
    if (selectedSite) {
      onSiteSelect(selectedSite);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img 
            src={logoImage} 
            alt="Leoni Logo" 
            className="h-16 mx-auto mb-6 rounded-lg shadow-md"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Leoni Connect Chat
          </h1>
          <p className="text-blue-100 text-lg">
            Sélectionnez votre site de travail
          </p>
        </div>

        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid gap-4 mb-8">
              {sites.map((site) => (
                <div
                  key={site}
                  onClick={() => handleSiteClick(site)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedSite === site
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className={`h-5 w-5 ${
                      selectedSite === site ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className={`font-medium ${
                      selectedSite === site ? 'text-primary' : 'text-foreground'
                    }`}>
                      {site}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleContinue}
              disabled={!selectedSite}
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-md"
              size="lg"
            >
              Continuer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};