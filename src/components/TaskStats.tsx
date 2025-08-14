import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Briefcase, User, GraduationCap } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    byCategory: {
      work: number;
      personal: number;
      studies: number;
    };
  };
}

export function TaskStats({ stats }: TaskStatsProps) {
  const mainStats = [
    {
      label: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle,
      className: 'text-green-600',
    },
    {
      label: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      className: 'text-orange-600',
    },
  ];

  const categoryStats = [
    {
      label: 'Trabalho',
      value: stats.byCategory.work,
      icon: Briefcase,
      variant: 'work' as const,
    },
    {
      label: 'Pessoal',
      value: stats.byCategory.personal,
      icon: User,
      variant: 'personal' as const,
    },
    {
      label: 'Estudos',
      value: stats.byCategory.studies,
      icon: GraduationCap,
      variant: 'studies' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {mainStats.map((stat) => (
        <Card key={stat.label} className="hover-lift transition-smooth">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <stat.icon className={`w-5 h-5 ${stat.className}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {categoryStats.map((stat) => (
        <Card key={stat.label} className="hover-lift transition-smooth">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <stat.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <Badge variant="secondary" className={`category-${stat.variant}`}>
                {stat.value}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}