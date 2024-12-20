import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { useAuth } from '../context/AuthContext';
import {
  Code,
  Terminal,
  Globe,
  Rocket,
  ChevronRight,
  BookOpen,
  Zap,
  CheckCircle2,
  Users,
  Trophy,
  ArrowRight,
  Check
} from 'lucide-react';
import MainLayout from '../Layout/MainLayout';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const benefits = [
    'Learn from industry experts with proven track records',
    'Access to 1000+ real-world project examples',
    'Personalized learning paths tailored to your goals',
    'Interactive coding environment with real-time feedback',
    'Job-ready portfolio building opportunities',
    'Industry-recognized certifications'
  ];

  const statistics = [
    { number: '10M+', label: 'Active Learners' },
    { number: '150+', label: 'Countries' },
    { number: '95%', label: 'Success Rate' },
    { number: '500+', label: 'Enterprise Clients' },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
     
        <div className="relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100 rounded-full filter blur-3xl opacity-20" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8" data-aos="fade-right">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-50 border border-teal-100">
                  <span className="text-sm font-medium text-teal-800">
                    Trusted by many companies
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                  Master the Art of
                  <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Modern Programming
                  </span>
                </h1>

                <p className="text-xl text-gray-600 max-w-xl">
                  Transform your coding journey with industry-leading curriculum, personalized learning paths, and cutting-edge tools designed for the modern developer.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={isAuthenticated ? '/dashboard' : '/get-started'}
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl hover:from-teal-700 hover:to-teal-600 transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>

                {/* Social Proof Pills */}
                <div className="flex flex-wrap gap-3">
                  {['⭐ 4.9/5 Rating', '🏆 Best of 2024', '🔒 Enterprise Grade'].map((item) => (
                    <div key={item} className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative" data-aos="fade-left">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-100 to-blue-100 rounded-3xl blur-3xl opacity-30" />
                <img
                  src="/images/coding.jpg"
                  alt="Premium Coding Platform"
                  className="relative rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section with Video */}
        <div className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <div className="space-y-8" data-aos="fade-right">
                <h2 className="text-3xl font-bold text-gray-900">
                  Why Choose CodeQuest?
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={benefit}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-teal-600" />
                      </div>
                      <p className="text-lg text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                className="relative rounded-lg overflow-hidden shadow-2xl"
                data-aos="fade-left"
              >
                <div className="aspect-video bg-gray-100 relative">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={`/images/developer-coding.mp4`} type="video/mp4" />
                  </video>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/10 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div 
                  key={stat.label}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="text-center p-6 rounded-xl bg-white shadow-lg border border-gray-100"
                >
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rest of the sections remain the same... */}
      </div>
    </MainLayout>
  );
};

export default LandingPage;