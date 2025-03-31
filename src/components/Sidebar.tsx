
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Activity, 
  MessageCircle, 
  Building2
} from 'lucide-react';

const Sidebar = () => {
  const { t } = useLanguage();

  const navItems = [
    { 
      name: t('dashboard'), 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: t('detect_disease'), 
      path: '/detect-disease', 
      icon: <Stethoscope className="h-5 w-5" /> 
    },
    { 
      name: t('assess_fitness'), 
      path: '/assess-fitness', 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: t('chatbot_ai'), 
      path: '/chatbot', 
      icon: <MessageCircle className="h-5 w-5" /> 
    },
    { 
      name: t('hospital_near_me'), 
      path: '/hospitals', 
      icon: <Building2 className="h-5 w-5" /> 
    },
  ];

  return (
    <aside className="bg-sidebar h-full w-64 fixed left-0 top-0 shadow-lg animate-fade-in">
      <div className="p-5">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-medical-600 to-medical-400 bg-clip-text text-transparent">MedAI</h1>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-gradient-medical text-white shadow-md'
                        : 'hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
