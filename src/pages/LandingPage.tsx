import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  BarChart2, 
  CheckCircle, 
  Users, 
  ArrowRight, 
  Star,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] text-[#191b23]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-[#2563eb] p-1.5 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Enterprise Learning</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
              <a href="#courses" className="hover:text-[#2563eb] transition-colors">Courses</a>
              <a href="#features" className="hover:text-[#2563eb] transition-colors">Features</a>
              <a href="#about" className="hover:text-[#2563eb] transition-colors">About</a>
              <Link to="/login" className="hover:text-[#2563eb] transition-colors">Login</Link>
              <Link 
                to="/login" 
                className="bg-[#2563eb] text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
              >
                Join for Free
              </Link>
            </div>

            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-600">
                <Zap className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-bold uppercase tracking-wider mb-6">
                <Shield className="w-4 h-4" />
                Trusted by 500+ Enterprises
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Transform Your Workforce with <span className="text-[#2563eb]">Enterprise-Grade</span> Learning
              </h1>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
                Scale your training, track progress, and empower your team with our comprehensive learning platform. Built for growth and designed for success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center gap-2 bg-[#2563eb] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#courses" 
                  className="inline-flex items-center justify-center bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-200 transition-all"
                >
                  View Courses
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-50" />
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                alt="People collaborating" 
                className="relative rounded-2xl shadow-2xl border border-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Active Students', value: '1M+' },
              { label: 'Total Courses', value: '10k+' },
              { label: 'Instructor Experts', value: '500+' },
              { label: 'Satisfaction Rate', value: '99%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-[#2563eb] mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">Why Choose Enterprise Learning?</h2>
            <p className="text-gray-600 text-lg">We provide everything you need to manage complex corporate training programs in one unified platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Globe className="w-8 h-8" />, 
                title: 'Scalable Curriculum', 
                desc: 'Manage thousands of courses across global departments with ease.' 
              },
              { 
                icon: <BarChart2 className="w-8 h-8" />, 
                title: 'Advanced Analytics', 
                desc: 'Get deep insights into student performance and course effectiveness.' 
              },
              { 
                icon: <CheckCircle className="w-8 h-8" />, 
                title: 'Integrated Assessments', 
                desc: 'Professional quiz and exam engines with automated grading.' 
              },
              { 
                icon: <Users className="w-8 h-8" />, 
                title: 'Seamless Enrollment', 
                desc: 'Automate student onboarding and course access management.' 
              },
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-[#2563eb]/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                <div className="text-[#2563eb] mb-6 p-3 rounded-xl bg-blue-50 inline-block group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section id="courses" className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">Popular Courses</h2>
              <p className="text-gray-600">Start learning from our most sought-after programs.</p>
            </div>
            <Link to="/login" className="hidden sm:flex items-center gap-2 text-[#2563eb] font-bold hover:underline">
              Explore All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Project Management Professional (PMP)',
                instructor: 'Sarah Jenkins',
                rating: 4.8,
                students: '12,450',
                price: '$89.99',
                img: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=400&q=80'
              },
              {
                title: 'Data Analytics for Strategic Leadership',
                instructor: 'Dr. Michael Chen',
                rating: 4.9,
                students: '8,200',
                price: '$94.99',
                img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'
              },
              {
                title: 'Agile & Scrum Mastery: Enterprise Edition',
                instructor: 'Emma Rodriguez',
                rating: 4.7,
                students: '15,100',
                price: '$79.99',
                img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80'
              },
              {
                title: 'Cloud Architecture & Security Design',
                instructor: 'David Wilson',
                rating: 4.9,
                students: '6,300',
                price: '$124.99',
                img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
              }
            ].map((course, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={course.img} alt={course.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                    Bestseller
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1 line-clamp-2 min-h-[3rem] group-hover:text-[#2563eb] transition-colors">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{course.instructor}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="font-bold text-[#b4690e]">{course.rating}</span>
                    <div className="flex text-[#b4690e]">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-current' : ''}`} />)}
                    </div>
                    <span className="text-xs text-gray-400">({course.students})</span>
                  </div>
                  <div className="font-extrabold text-xl">{course.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#191b23] rounded-[2.5rem] p-8 lg:p-20 relative overflow-hidden text-center lg:text-left">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2563eb]/10 -skew-x-12 translate-x-1/4" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">Ready to scale your team's knowledge?</h2>
                <p className="text-gray-400 text-lg mb-10">Join thousands of organizations that use Enterprise Learning to build a more capable workforce.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/login" 
                    className="bg-[#2563eb] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Get Started Now
                  </Link>
                  <button className="bg-transparent text-white border-2 border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all">
                    Contact Sales
                  </button>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="text-[#2563eb] font-bold text-2xl mb-1">98%</div>
                    <div className="text-gray-400 text-sm">Completion Rate</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="text-[#2563eb] font-bold text-2xl mb-1">24/7</div>
                    <div className="text-gray-400 text-sm">Expert Support</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="text-[#2563eb] font-bold text-2xl mb-1">100+</div>
                    <div className="text-gray-400 text-sm">Integrations</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                    <div className="text-[#2563eb] font-bold text-2xl mb-1">ISO</div>
                    <div className="text-gray-400 text-sm">Certified Security</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#2563eb] p-1.5 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">Enterprise Learning</span>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6 max-w-sm">
                The world's most advanced learning management system designed specifically for the needs of modern enterprises.
              </p>
              <div className="flex gap-4">
                {[Globe, Zap, Shield, Users].map((Icon, i) => (
                  <a key={i} href="#" className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-[#2563eb] hover:bg-blue-50 transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#2563eb]">Browse Courses</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">LMS Integration</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">Corporate Training</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">Certifications</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#2563eb]">About Us</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">Careers</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">Blog</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#2563eb]">Help Center</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">System Status</a></li>
                <li><a href="#" className="hover:text-[#2563eb]">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-sm text-gray-400">
            <p>© 2026 Enterprise Learning Inc. All rights reserved.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#2563eb]">Privacy Policy</a>
              <a href="#" className="hover:text-[#2563eb]">Terms of Service</a>
              <a href="#" className="hover:text-[#2563eb]">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
