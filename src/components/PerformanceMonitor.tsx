import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Wifi, Database, Clock } from 'lucide-react';

interface PerformanceMetrics {
  memory: number;
  loadTime: number;
  renderTime: number;
  networkLatency: number;
  cacheHitRate: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar apenas em desenvolvimento
    if (process.env.NODE_ENV !== 'development') return;

    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const renderTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      
      setMetrics({
        memory: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        networkLatency: Math.round(navigation.responseStart - navigation.requestStart),
        cacheHitRate: 85 // Simulado - em produção viria do cache real
      });
    };

    // Coletar métricas após carregamento
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    // Atualizar métricas a cada 10 segundos
    const interval = setInterval(collectMetrics, 10000);

    return () => {
      window.removeEventListener('load', collectMetrics);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!metrics || !isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getStatusColor = (value: number, thresholds: [number, number]): "default" | "destructive" | "outline" | "secondary" => {
    if (value <= thresholds[0]) return 'secondary';
    if (value <= thresholds[1]) return 'outline';
    return 'destructive';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-card/95 backdrop-blur-sm border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Monitor
            <Badge variant="outline" className="ml-auto">DEV</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Memória
            </span>
            <Badge variant={getStatusColor(metrics.memory, [50, 100])} className="text-xs">
              {metrics.memory}MB
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Load Time
              </span>
              <span>{metrics.loadTime}ms</span>
            </div>
            <Progress 
              value={Math.min((metrics.loadTime / 3000) * 100, 100)} 
              className="h-1"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                Network
              </span>
              <span>{metrics.networkLatency}ms</span>
            </div>
            <Progress 
              value={Math.min((metrics.networkLatency / 500) * 100, 100)} 
              className="h-1"
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Cache Hit Rate</span>
            <Badge variant="secondary" className="text-xs">
              {metrics.cacheHitRate}%
            </Badge>
          </div>

          <div className="text-muted-foreground text-xs pt-2 border-t">
            Ctrl+Shift+P para alternar
          </div>
        </CardContent>
      </Card>
    </div>
  );
}