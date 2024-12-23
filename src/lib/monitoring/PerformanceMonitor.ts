export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();

  static startMeasure(name: string) {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      const measurements = this.measurements.get(name) || [];
      measurements.push(duration);
      this.measurements.set(name, measurements);
      
      // Log if duration is above threshold
      if (duration > 500) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  static getAverageTime(name: string): number {
    const measurements = this.measurements.get(name) || [];
    if (measurements.length === 0) return 0;
    
    const sum = measurements.reduce((acc, val) => acc + val, 0);
    return sum / measurements.length;
  }

  static clearMeasurements() {
    this.measurements.clear();
  }
}