import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Monitor, 
  Package, 
  ShoppingCart, 
  Building, 
  Truck, 
  Award, 
  Factory, 
  Wrench, 
  Cog,
  ArrowRight,
  ArrowLeft 
} from 'lucide-react';

interface DepartmentSelectionProps {
  selectedSite: string;
  onDepartmentSelect: (department: string) => void;
  onBack: () => void;
}

const departments = [
  { name: 'RH', icon: Users, description: 'Ressources Humaines' },
  { name: 'IT', icon: Monitor, description: 'Technologies de l\'Information' },
  { name: 'POO', icon: Package, description: 'Planification et Organisation' },
  { name: 'Service d\'achat', icon: ShoppingCart, description: 'Achats et Approvisionnement' },
  { name: 'Service de bâtiment', icon: Building, description: 'Maintenance des Bâtiments' },
  { name: 'Logistique', icon: Truck, description: 'Logistique et Transport' },
  { name: 'Qualité', icon: Award, description: 'Contrôle Qualité' },
  { name: 'Production', icon: Factory, description: 'Ligne de Production' },
  { name: 'Engineering', icon: Cog, description: 'Ingénierie et Développement' },
  { name: 'Maintenance', icon: Wrench, description: 'Maintenance Technique' }
];

export const DepartmentSelection = ({ selectedSite, onDepartmentSelect, onBack }: DepartmentSelectionProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const handleDepartmentClick = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleContinue = () => {
    if (selectedDepartment) {
      onDepartmentSelect(selectedDepartment);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Sélection du département
          </h1>
          <p className="text-blue-100 text-lg">
            Site: <span className="font-semibold">{selectedSite}</span>
          </p>
        </div>

        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {departments.map((dept) => {
                const IconComponent = dept.icon;
                return (
                  <div
                    key={dept.name}
                    onClick={() => handleDepartmentClick(dept.name)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedDepartment === dept.name
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`h-6 w-6 ${
                        selectedDepartment === dept.name ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          selectedDepartment === dept.name ? 'text-primary' : 'text-foreground'
                        }`}>
                          {dept.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {dept.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={onBack}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour
              </Button>
              
              <Button 
                onClick={handleContinue}
                disabled={!selectedDepartment}
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-md"
                size="lg"
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};