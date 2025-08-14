import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Settings, User } from 'lucide-react';

const characterAvatar = '/lovable-uploads/3ebb38af-6df7-4d03-92d3-a108904d9a1f.png';

export function UserButton() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: 'Erro',
          description: 'Erro ao fazer logout',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Logout realizado',
          description: 'Até logo!'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro inesperado',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full macos-hover">
          <Avatar className="h-10 w-10">
            <AvatarImage src={characterAvatar} alt="User" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.email && (
              <p className="font-medium">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer macos-system-element" 
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600" 
          onClick={handleSignOut}
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}