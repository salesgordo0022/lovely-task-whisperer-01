import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, CheckCircle, Target, TrendingUp, BarChart3 } from 'lucide-react';
import logoImage from '@/assets/logo.png';
import heroBg from '@/assets/hero-bg.jpg';

export function ProfessionalAuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se já está logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.href = '/';
      }
    });
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: 'Erro no cadastro',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Cadastro realizado!',
          description: 'Verifique seu email para confirmar a conta.'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro inesperado no cadastro',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: 'Erro no login',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo de volta!'
        });
        window.location.href = '/';
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro inesperado no login',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: `var(--gradient-hero), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-primary/90" />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-primary-foreground text-center">
          {/* Logo e Brand */}
          <div className="mb-8 macos-fade-in">
            <img src={logoImage} alt="notebook.ai" className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-2">notebook.ai</h1>
            <p className="text-xl opacity-90">Sistema de Produtividade Inteligente</p>
          </div>

          {/* Apresentação Simples */}
          <div className="space-y-8 max-w-md macos-slide-up">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Organize suas tarefas com inteligência
              </h2>
              <p className="text-lg opacity-90 leading-relaxed">
                Gerencie projetos, acompanhe metas e aumente sua produtividade com ferramentas modernas e intuitivas.
              </p>
            </div>

            {/* Features simples */}
            <div className="grid gap-4">
              <div className="flex items-center space-x-3 text-left">
                <Target className="w-6 h-6 flex-shrink-0" />
                <span className="text-lg">Organização inteligente de tarefas</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <TrendingUp className="w-6 h-6 flex-shrink-0" />
                <span className="text-lg">Acompanhamento de produtividade</span>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <BarChart3 className="w-6 h-6 flex-shrink-0" />
                <span className="text-lg">Relatórios e insights detalhados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 macos-fade-in">
            <img src={logoImage} alt="notebook.ai" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">notebook.ai</h1>
            <p className="text-muted-foreground">Sistema de Produtividade</p>
          </div>

          <Card className="border-0 shadow-large bg-card macos-slide-up">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Acesse sua conta
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Entre para gerenciar suas tarefas e projetos
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="text-sm font-medium">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm font-medium">
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                          Senha
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium macos-button" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Entrar
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                          Senha
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium macos-button" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Conta
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground">
                  Ao continuar, você concorda com nossos{' '}
                  <a href="#" className="text-primary hover:underline">Termos de Uso</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}