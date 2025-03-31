
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface FormData {
  height: string;
  weight: string;
  diet: string;
  alcohol: string;
  smoking: string;
  exercise: string;
  age: string;
}

const initialFormData: FormData = {
  height: '',
  weight: '',
  diet: '',
  alcohol: '',
  smoking: '',
  exercise: '',
  age: '',
};

const AssessFitness = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [assessment, setAssessment] = useState<any>(null);
  const [isAssessing, setIsAssessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssessing(true);
    
    // Mock API call to assess fitness (replace with real API call)
    setTimeout(() => {
      // Calculate BMI for simple health indicator
      const height = parseFloat(formData.height) / 100; // convert cm to m
      const weight = parseFloat(formData.weight);
      const bmi = height > 0 ? weight / (height * height) : 0;
      
      // Generate mock assessment
      let riskLevel = "Low";
      let riskScore = 20;
      
      // Increase risk based on form values
      if (formData.smoking === 'heavy') {
        riskLevel = "High";
        riskScore += 40;
      } else if (formData.smoking === 'moderate') {
        riskLevel = "Medium";
        riskScore += 20;
      } else if (formData.smoking === 'light') {
        riskScore += 10;
      }
      
      if (formData.alcohol === 'heavy') {
        riskLevel = "High";
        riskScore += 30;
      } else if (formData.alcohol === 'moderate') {
        riskScore += 15;
      }
      
      if (formData.exercise === 'none') {
        riskScore += 20;
        if (riskLevel !== "High") riskLevel = "Medium";
      }
      
      if (bmi > 30) {
        riskScore += 30;
        if (riskLevel !== "High") riskLevel = "Medium";
      } else if (bmi > 25) {
        riskScore += 15;
      }
      
      // Cap the score at 100
      riskScore = Math.min(riskScore, 100);
      
      setAssessment({
        bmi: bmi.toFixed(1),
        riskLevel,
        riskScore,
        recommendations: [
          "Schedule regular check-ups with your doctor",
          formData.smoking !== 'none' ? "Reduce or quit smoking" : "",
          formData.alcohol === 'heavy' ? "Reduce alcohol consumption" : "",
          formData.exercise === 'none' ? "Start a regular exercise routine" : "",
          "Maintain a balanced diet with plenty of fruits and vegetables",
        ].filter(Boolean),
      });
      
      setIsAssessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('assess_fitness')}</h1>
        <p className="text-muted-foreground">Complete the form below for a health risk assessment</p>
      </div>

      {!assessment ? (
        <Card>
          <CardHeader>
            <CardTitle>Health Questionnaire</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">{t('Age')}</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">{t('height')} ({t('cm')})</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="Enter your height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">{t('weight')} ({t('kg')})</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="Enter your weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet">{t('diet')}</Label>
                  <Select 
                    value={formData.diet}
                    onValueChange={(value) => handleSelectChange('diet', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="paleo">Paleo</SelectItem>
                      <SelectItem value="irregular">Irregular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alcohol">{t('alcohol')}</Label>
                  <Select 
                    value={formData.alcohol}
                    onValueChange={(value) => handleSelectChange('alcohol', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select consumption level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="light">Light (Occasionally)</SelectItem>
                      <SelectItem value="moderate">Moderate (Weekly)</SelectItem>
                      <SelectItem value="heavy">Heavy (Daily)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smoking">{t('smoking')}</Label>
                  <Select
                    value={formData.smoking}
                    onValueChange={(value) => handleSelectChange('smoking', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select smoking habits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="former">Former smoker</SelectItem>
                      <SelectItem value="light">Light (Occasionally)</SelectItem>
                      <SelectItem value="moderate">Moderate (Weekly)</SelectItem>
                      <SelectItem value="heavy">Heavy (Daily)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exercise">Exercise Frequency</Label>
                  <Select
                    value={formData.exercise}
                    onValueChange={(value) => handleSelectChange('exercise', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-4 days/week)</SelectItem>
                      <SelectItem value="active">Active (5+ days/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-6 bg-gradient-medical"
                disabled={isAssessing}
              >
                {isAssessing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                    Calculating...
                  </>
                ) : 'Submit Assessment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Fitness Assessment Results</span>
                <Button variant="outline" onClick={() => {
                  setAssessment(null);
                  setFormData(initialFormData);
                }}>
                  Start New Assessment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">BMI</h3>
                        <p className="text-3xl font-bold">{assessment.bmi}</p>
                        <p className="text-xs mt-1">
                          {parseFloat(assessment.bmi) < 18.5 ? 'Underweight' :
                           parseFloat(assessment.bmi) < 25 ? 'Normal' :
                           parseFloat(assessment.bmi) < 30 ? 'Overweight' : 'Obese'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Risk Level</h3>
                        <p className={`text-xl font-bold ${
                          assessment.riskLevel === 'Low' ? 'text-green-600' :
                          assessment.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {assessment.riskLevel}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Risk Score</h3>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                            <div
                              style={{ width: `${assessment.riskScore}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                assessment.riskScore < 30 ? 'bg-green-500' :
                                assessment.riskScore < 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            />
                          </div>
                          <p className="text-xl font-bold">{assessment.riskScore}/100</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <ul className="space-y-2">
                      {assessment.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
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

export default AssessFitness;
