
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  TrendingUp,
  User,
  Calendar,
  Bell,
  Stethoscope,
  Activity
} from 'lucide-react';

// Disease information cards with symptoms
const diseaseInfo = [
  {
    id: 'pneumonia',
    title: 'Pneumonia',
    symptoms: [
      'Chest pain when breathing or coughing',
      'Confusion or changes in mental awareness',
      'Coughing that produces phlegm',
      'Fatigue',
      'Fever, sweating and shaking chills',
      'Lower than normal body temperature'
    ],
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'lung-cancer',
    title: 'Lung Cancer',
    symptoms: [
      'Persistent cough',
      'Coughing up blood',
      'Chest pain',
      'Hoarseness',
      'Unexplained weight loss',
      'Bone pain'
    ],
    color: 'from-red-400 to-red-600'
  },
  {
    id: 'tuberculosis',
    title: 'Tuberculosis',
    symptoms: [
      'Coughing that lasts three or more weeks',
      'Coughing up blood',
      'Chest pain, or pain with breathing or coughing',
      'Unintentional weight loss',
      'Fatigue',
      'Night sweats'
    ],
    color: 'from-yellow-400 to-yellow-600'
  },
];

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick stats cards */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risk Assessment</p>
              <h3 className="text-2xl font-bold mt-1">Low Risk</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Check-up</p>
              <h3 className="text-2xl font-bold mt-1">14 days ago</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Health Alerts</p>
              <h3 className="text-2xl font-bold mt-1">None</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-4 rounded-full mb-4">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold">{t('detect_disease')}</h3>
            <p className="text-sm text-muted-foreground mt-1">Upload X-Ray or CT scan</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-full mb-4">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold">{t('assess_fitness')}</h3>
            <p className="text-sm text-muted-foreground mt-1">Check your health status</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-full mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold">Medical Profile</h3>
            <p className="text-sm text-muted-foreground mt-1">Update your health info</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold">Emergency Info</h3>
            <p className="text-sm text-muted-foreground mt-1">View critical information</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">{t('symptoms')} & Information</h2>
      
      <div className="grid gap-6 mb-8">
        {diseaseInfo.map((disease) => (
          <div key={disease.id} className="disease-card animate-fade-in">
            <div className={`bg-gradient-to-r ${disease.color} p-4 text-white`}>
              <h3 className="text-xl font-semibold">{disease.title} {t('symptoms')}</h3>
            </div>
            <div className="p-4">
              <ul className="list-disc pl-5 space-y-2">
                {disease.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
