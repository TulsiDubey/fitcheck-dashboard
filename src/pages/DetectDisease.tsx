import React, { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileX, FileCheck, Download } from 'lucide-react';
import axios from 'axios';

// Define the API response type
interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: {
    Normal: number;
    Pneumonia: number;
    TB: number;
  };
}

// Update the results interface to match what we'll use
interface AnalysisResults {
  disease: string;
  confidence: number;
  probabilities: {
    [key: string]: number;
  };
  normalImage?: string; // We'll keep this for the comparison image
}

const DetectDisease = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | AnalysisResults>(null);
  const [error, setError] = useState<string | null>(null);
  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API endpoint URL - replace with your actual Flask API URL
  const API_URL = 'http://localhost:5000/api/predict';

  // Function to trigger file input click
  const handleUploadClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset results and errors
      setResults(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    // Create form data to send file
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Make API call to Flask backend
      const response = await axios.post<PredictionResult>(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Process the results
      const apiResults = response.data;
      
      // Map API response to our UI format
      const analysisResults: AnalysisResults = {
        disease: apiResults.prediction,
        confidence: apiResults.confidence,
        probabilities: apiResults.probabilities,
        // We'll keep using a placeholder for normal image comparison
        normalImage: "http://localhost:5000/static/uploads/IM-0010-0001.jpeg",
      };
      
      setResults(analysisResults);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setError(null);
  };

  const downloadPdf = () => {
    // Mock PDF download (in a real app, generate a real PDF)
    alert("In a real application, this would download a PDF report.");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('detect_disease')}</h1>
        <p className="text-muted-foreground">Upload an X-ray or CT scan image to detect potential diseases</p>
      </div>

      <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
        <CardContent className="p-8 text-center">
          {!preview ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('upload_image')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Support for JPG, PNG, DICOM formats up to 10MB
              </p>
              
              {/* Hidden file input with ref */}
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              
              {/* Button that triggers the file input */}
              <Button 
                variant="default" 
                className="bg-gradient-medical"
                type="button"
                onClick={handleUploadClick}
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Uploaded scan" 
                    className="max-h-64 object-contain rounded-md" 
                  />
                  <button 
                    onClick={handleReset}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <FileX className="h-5 w-5 text-red-500" />
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                  </p>
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm py-2 px-4 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              {!results && (
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-medical"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                      Analyzing...
                    </>
                  ) : 'Analyze Image'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-700 flex items-center">
                  <FileCheck className="mr-2 h-5 w-5" />
                  Analysis Complete
                </h3>
                <Button onClick={downloadPdf} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>

              <div className={`bg-${results.disease === 'Normal' ? 'green' : 'amber'}-50 border border-${results.disease === 'Normal' ? 'green' : 'amber'}-200 p-4 rounded-md mb-4`}>
                <p className="font-medium">Detected: {results.disease}</p>
                <p className="text-sm">Confidence: {results.confidence.toFixed(1)}%</p>
                
                {/* Display all probabilities */}
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Probability breakdown:</p>
                  <div className="space-y-1">
                    {Object.entries(results.probabilities).map(([condition, probability]) => (
                      <div key={condition} className="flex justify-between text-xs">
                        <span>{condition}:</span>
                        <span>{probability.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Comparison:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <img 
                      src={results.normalImage} 
                      alt="Normal scan" 
                      className="w-full h-48 object-cover rounded-md mb-2" 
                    />
                    <p className="text-sm font-medium">Normal X-ray</p>
                  </div>
                  <div className="text-center">
                    <img 
                      src={preview || ''} 
                      alt="Patient scan" 
                      className="w-full h-48 object-cover rounded-md mb-2" 
                    />
                    <p className="text-sm font-medium">Patient X-ray ({results.disease})</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DetectDisease;


// import React, { useState } from 'react';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Upload, FileX, FileCheck, Download } from 'lucide-react';

// const DetectDisease = () => {
//   const { t } = useLanguage();
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [results, setResults] = useState<null | {
//     disease: string;
//     confidence: number;
//     normalImage: string;
//     comparison: string;
//   }>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
//       setFile(selectedFile);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target) {
//           setPreview(e.target.result as string);
//         }
//       };
//       reader.readAsDataURL(selectedFile);
      
//       // Reset results
//       setResults(null);
//     }
//   };

//   const handleAnalyze = () => {
//     if (!file) return;
    
//     setIsAnalyzing(true);
    
//     // Mock API call (replace with real API in production)
//     setTimeout(() => {
//       // Mock disease detection results
//       const mockResults = {
//         disease: "Pneumonia",
//         confidence: 0.89,
//         normalImage: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=300&auto=format&fit=crop",
//         comparison: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=300&auto=format&fit=crop",
//       };
      
//       setResults(mockResults);
//       setIsAnalyzing(false);
//     }, 3000);
//   };

//   const handleReset = () => {
//     setFile(null);
//     setPreview(null);
//     setResults(null);
//   };

//   const downloadPdf = () => {
//     // Mock PDF download (in a real app, generate a real PDF)
//     alert("In a real application, this would download a PDF report.");
//   };

//   return (
//     <div className="space-y-8 animate-fade-in">
//       <div>
//         <h1 className="text-3xl font-bold mb-2">{t('detect_disease')}</h1>
//         <p className="text-muted-foreground">Upload an X-ray or CT scan image to detect potential diseases</p>
//       </div>

//       <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
//         <CardContent className="p-8 text-center">
//           {!preview ? (
//             <div className="flex flex-col items-center justify-center py-10">
//               <Upload className="h-12 w-12 text-gray-400 mb-4" />
//               <h3 className="text-lg font-medium mb-2">{t('upload_image')}</h3>
//               <p className="text-sm text-muted-foreground mb-4">
//                 Support for JPG, PNG, DICOM formats up to 10MB
//               </p>
//               <label htmlFor="file-upload">
//                 <input
//                   id="file-upload"
//                   name="file-upload"
//                   type="file"
//                   className="sr-only"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                 />
//                 <Button 
//                   variant="default" 
//                   className="bg-gradient-medical"
//                   type="button"
//                 >
//                   <Upload className="h-4 w-4 mr-2" />
//                   Browse Files
//                 </Button>
//               </label>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="flex flex-col items-center">
//                 <div className="relative">
//                   <img 
//                     src={preview} 
//                     alt="Uploaded scan" 
//                     className="max-h-64 object-contain rounded-md" 
//                   />
//                   <button 
//                     onClick={handleReset}
//                     className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
//                   >
//                     <FileX className="h-5 w-5 text-red-500" />
//                   </button>
//                 </div>
//                 <div className="mt-4">
//                   <p className="text-sm font-medium">{file?.name}</p>
//                   <p className="text-xs text-muted-foreground">
//                     {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
//                   </p>
//                 </div>
//               </div>
              
//               {!results && (
//                 <Button 
//                   onClick={handleAnalyze}
//                   disabled={isAnalyzing}
//                   className="w-full bg-gradient-medical"
//                 >
//                   {isAnalyzing ? (
//                     <>
//                       <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
//                       Analyzing...
//                     </>
//                   ) : 'Analyze Image'}
//                 </Button>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {results && (
//         <div className="space-y-6 animate-fade-in">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-green-700 flex items-center">
//                   <FileCheck className="mr-2 h-5 w-5" />
//                   Analysis Complete
//                 </h3>
//                 <Button onClick={downloadPdf} variant="outline">
//                   <Download className="mr-2 h-4 w-4" />
//                   Download Report
//                 </Button>
//               </div>

//               <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
//                 <p className="font-medium">Detected: {results.disease}</p>
//                 <p className="text-sm">Confidence: {(results.confidence * 100).toFixed(1)}%</p>
//               </div>

//               <div>
//                 <h4 className="font-medium mb-3">Comparison:</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="text-center">
//                     <img 
//                       src={results.normalImage} 
//                       alt="Normal scan" 
//                       className="w-full h-48 object-cover rounded-md mb-2" 
//                     />
//                     <p className="text-sm font-medium">Normal X-ray</p>
//                   </div>
//                   <div className="text-center">
//                     <img 
//                       src={preview || ''} 
//                       alt="Patient scan" 
//                       className="w-full h-48 object-cover rounded-md mb-2" 
//                     />
//                     <p className="text-sm font-medium">Patient X-ray</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetectDisease;
