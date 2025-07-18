import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoImage from '/lovable-uploads/14cd5539-4024-49ac-a0f3-22b6f193d738.png';

interface LoginProps {
  selectedSite: string;
  selectedDepartment: string;
  onLogin: (email: string) => void;
  onBack: () => void;
}

export const Login = ({ selectedSite, selectedDepartment, onLogin, onBack }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return email.toLowerCase().includes('@leoni.com');
  };

  const validatePassword = (password: string) => {
    // Mot de passe difficile : au moins 8 caractères, majuscule, minuscule, chiffre, caractère spécial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation email Leoni
    if (!validateEmail(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez utiliser votre adresse email Leoni (@leoni.com)",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Validation mot de passe
    if (!validatePassword(password)) {
      toast({
        title: "Mot de passe faible",
        description: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simulation de connexion
    setTimeout(() => {
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans Leoni Connect Chat"
      });
      onLogin(email);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={logoImage} 
            alt="Leoni Logo" 
            className="h-16 mx-auto mb-6 rounded-lg shadow-md"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Connexion
          </h1>
          <div className="text-blue-100">
            <p>Site: <span className="font-semibold">{selectedSite}</span></p>
            <p>Département: <span className="font-semibold">{selectedDepartment}</span></p>
          </div>
        </div>

        <Card className="shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              Authentification Leoni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Leoni</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.nom@leoni.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Mot de passe</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mot de passe sécurisé"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Min. 8 caractères, majuscule, minuscule, chiffre et caractère spécial
                </p>
              </div>

              <div className="flex space-x-4">
                <Button 
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                
                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-md"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Se connecter
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};