import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Brain, FileText, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { DataTable } from '@/components/DataTable';
import { AIChat } from '@/components/AIChat';
import { ImageOCR } from '@/components/ImageOCR';
import { DataCleaning } from '@/components/DataCleaning';

const Index = () => {
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState<any[]>([]);
  const [currentFilename, setCurrentFilename] = useState<string>('');
  const [currentFileType, setCurrentFileType] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleDataLoad = (data: any[], filename: string, type: string) => {
    setCurrentData(data);
    setCurrentFilename(filename);
    setCurrentFileType(type);
    setActiveTab('data');
  };

  const handleImageLoad = (file: File) => {
    setCurrentImage(file);
    setActiveTab('ocr');
  };

  const handleTextExtracted = (text: string, data: any[]) => {
    if (data.length > 0) {
      setCurrentData(data);
      setCurrentFilename(`${currentImage?.name || 'image'}_extracted_data`);
      setCurrentFileType('ocr');
      setActiveTab('data');
    }
  };

  const handleDataCleaned = (cleanedData: any[]) => {
    setCurrentData(cleanedData);
    setActiveTab('data');
  };

  const navigateToVisualizations = () => {
    navigate('/visualizations', { 
      state: { 
        data: currentData, 
        filename: currentFilename 
      } 
    });
  };

  return (
    <div className="min-h-screen hero-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-primary/20 via-transparent to-chart-secondary/20"></div>
        
        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 right-16 w-24 h-24 bg-accent/10 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-chart-secondary/10 rounded-full blur-2xl opacity-50 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center space-y-8 max-w-5xl mx-auto stagger-animation">
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="p-4 rounded-full bg-gradient-to-r from-chart-primary to-chart-secondary pulse-glow animate-float">
                <Brain className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-chart-primary via-accent to-chart-secondary bg-clip-text text-transparent">
                  DataMind AI
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-chart-primary to-accent mx-auto rounded-full" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Intelligent data analytics platform with AI-powered insights. Clean, analyze, and visualize your data with advanced OCR and machine learning capabilities.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-12">
              <div className="flex items-center gap-3 text-sm glass-card px-6 py-3 rounded-full hover:scale-105 transition-transform animate-slide-up">
                <FileText className="h-5 w-5 text-chart-primary" />
                <span className="font-medium">Excel, CSV, JSON</span>
              </div>
              <div className="flex items-center gap-3 text-sm glass-card px-6 py-3 rounded-full hover:scale-105 transition-transform animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Brain className="h-5 w-5 text-chart-secondary" />
                <span className="font-medium">AI Analytics</span>
              </div>
              <div className="flex items-center gap-3 text-sm glass-card px-6 py-3 rounded-full hover:scale-105 transition-transform animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <BarChart3 className="h-5 w-5 text-chart-tertiary" />
                <span className="font-medium">Smart Visualizations</span>
              </div>
              <div className="flex items-center gap-3 text-sm glass-card px-6 py-3 rounded-full hover:scale-105 transition-transform animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Zap className="h-5 w-5 text-chart-warning" />
                <span className="font-medium">Real-time OCR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="glass-card p-2 h-16 grid grid-cols-5 w-full max-w-4xl">
              <TabsTrigger value="upload" className="flex items-center gap-3 text-sm font-medium h-12 rounded-lg transition-all duration-300 hover:scale-105">
                <FileText className="h-5 w-5" />
                <span className="hidden sm:inline">Upload Data</span>
                <span className="sm:hidden">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="data" disabled={currentData.length === 0} className="flex items-center gap-3 text-sm font-medium h-12 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50">
                <BarChart3 className="h-5 w-5" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Data</span>
              </TabsTrigger>
              <TabsTrigger value="clean" disabled={currentData.length === 0} className="flex items-center gap-3 text-sm font-medium h-12 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50">
                <Sparkles className="h-5 w-5" />
                <span className="hidden sm:inline">Clean Data</span>
                <span className="sm:hidden">Clean</span>
              </TabsTrigger>
              <TabsTrigger value="ai" disabled={currentData.length === 0} className="flex items-center gap-3 text-sm font-medium h-12 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50">
                <Brain className="h-5 w-5" />
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger value="ocr" className="flex items-center gap-3 text-sm font-medium h-12 rounded-lg transition-all duration-300 hover:scale-105">
                <Zap className="h-5 w-5" />
                <span className="hidden sm:inline">Text Extract</span>
                <span className="sm:hidden">OCR</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upload" className="animate-slide-up">
            <div className="floating-card">
              <FileUpload 
                onDataLoad={handleDataLoad}
                onImageLoad={handleImageLoad}
              />
            </div>
            
            {/* Quick Stats */}
            {currentData.length > 0 && (
              <div className="mt-8 animate-scale-bounce">
                <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Data Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-animation">
                  <div className="floating-card p-8 text-center group">
                    <div className="p-4 rounded-full bg-gradient-to-r from-chart-primary/20 to-chart-primary/10 mx-auto w-fit mb-4 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-10 w-10 text-chart-primary" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Total Rows</h4>
                    <p className="text-3xl font-bold text-chart-primary">{currentData.length.toLocaleString()}</p>
                  </div>
                  <div className="floating-card p-8 text-center group">
                    <div className="p-4 rounded-full bg-gradient-to-r from-chart-secondary/20 to-chart-secondary/10 mx-auto w-fit mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="h-10 w-10 text-chart-secondary" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">Columns</h4>
                    <p className="text-3xl font-bold text-chart-secondary">
                      {currentData.length > 0 ? Object.keys(currentData[0]).length : 0}
                    </p>
                  </div>
                  <div className="floating-card p-8 text-center group">
                    <div className="p-4 rounded-full bg-gradient-to-r from-chart-tertiary/20 to-chart-tertiary/10 mx-auto w-fit mb-4 group-hover:scale-110 transition-transform">
                      <Brain className="h-10 w-10 text-chart-tertiary" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">File Type</h4>
                    <p className="text-3xl font-bold text-chart-tertiary">{currentFileType.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="data" className="animate-slide-up">
            <div className="space-y-6">
              <div className="floating-card">
                <DataTable 
                  data={currentData}
                  filename={currentFilename}
                  type={currentFileType}
                />
              </div>
              
            </div>
          </TabsContent>

          <TabsContent value="clean" className="animate-slide-up">
            <DataCleaning 
              data={currentData}
              onDataCleaned={handleDataCleaned}
            />
          </TabsContent>

          <TabsContent value="ai" className="animate-slide-up">
            <div className="floating-card">
              <AIChat 
                data={currentData}
                filename={currentFilename}
              />
            </div>
          </TabsContent>

          <TabsContent value="ocr" className="animate-slide-up">
            <div className="floating-card">
              <ImageOCR 
                imageFile={currentImage}
                onTextExtracted={handleTextExtracted}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Feature Highlights */}
        {activeTab === 'upload' && currentData.length === 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powerful Features at Your Fingertips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
              <div className="floating-card p-10 text-center space-y-6 group">
                <div className="p-6 rounded-full bg-gradient-to-r from-chart-primary to-chart-secondary mx-auto w-fit group-hover:scale-110 transition-all duration-300">
                  <Brain className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">AI-Powered Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get intelligent insights, pattern detection, and automated recommendations from your data with advanced machine learning algorithms.
                  </p>
                </div>
              </div>

              <div className="floating-card p-10 text-center space-y-6 group">
                <div className="p-6 rounded-full bg-gradient-to-r from-chart-secondary to-chart-tertiary mx-auto w-fit group-hover:scale-110 transition-all duration-300">
                  <FileText className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Multi-Format Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Work seamlessly with Excel, CSV, JSON files, and extract structured data from images using state-of-the-art OCR technology.
                  </p>
                </div>
              </div>

              <div className="floating-card p-10 text-center space-y-6 group">
                <div className="p-6 rounded-full bg-gradient-to-r from-chart-tertiary to-chart-warning mx-auto w-fit group-hover:scale-110 transition-all duration-300">
                  <BarChart3 className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Interactive Visualizations</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Explore your data with dynamic charts, real-time filtering, and comprehensive analysis tools that adapt to your dataset.
                  </p>
                </div>
              </div>

              <div className="floating-card p-10 text-center space-y-6 group">
                <div className="p-6 rounded-full bg-gradient-to-r from-chart-warning to-chart-danger mx-auto w-fit group-hover:scale-110 transition-all duration-300">
                  <Sparkles className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Smart Data Cleaning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Automatically detect and fix data quality issues, remove duplicates, and standardize formats for cleaner analysis.
                  </p>
                </div>
              </div>

              <div className="floating-card p-10 text-center space-y-6 group">
                <div className="p-6 rounded-full bg-gradient-to-r from-chart-danger to-chart-primary mx-auto w-fit group-hover:scale-110 transition-all duration-300">
                  <Zap className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Real-time Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Process large datasets instantly with optimized algorithms and get immediate feedback on your data operations.
                  </p>
                </div>
              </div>

              <div className="floating-card p-10 text-center space-y-6 group">
                <div className="p-6 rounded-full bg-gradient-to-r from-chart-success to-chart-primary mx-auto w-fit group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="h-12 w-12 text-primary-foreground" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Advanced Analytics</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Perform statistical analysis, trend detection, and predictive modeling with enterprise-grade analytical capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
