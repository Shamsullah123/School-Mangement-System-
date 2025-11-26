import React from 'react';
import { Card } from '../components/UI';
import { ArrowRight, CheckCircle, GraduationCap, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-indigo-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Manage Your School <br/> <span className="text-indigo-300">Intelligently</span></h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            EduSphere streamlines administration, enhances learning, and connects parents with an all-in-one AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/login" className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-50 transition shadow-lg">Get Started</Link>
             <Link to="/about" className="border-2 border-indigo-300 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-600 transition">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Why Choose EduSphere?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<GraduationCap className="w-12 h-12 text-indigo-600" />}
              title="Student Management"
              desc="Track academic progress, attendance, and behavioral records in one secure place."
            />
            <FeatureCard 
              icon={<Users className="w-12 h-12 text-indigo-600" />}
              title="Parent Connect"
              desc="Real-time SMS updates and portals for parents to stay involved in their child's growth."
            />
            <FeatureCard 
              icon={<Shield className="w-12 h-12 text-indigo-600" />}
              title="Secure & Reliable"
              desc="Enterprise-grade security ensures sensitive student and financial data is always protected."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-xl transition-shadow border border-slate-100 text-center">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

export const About: React.FC = () => (
  <div className="max-w-4xl mx-auto py-16 px-4">
    <h1 className="text-4xl font-bold text-slate-900 mb-6">About EduSphere</h1>
    <div className="prose prose-lg text-slate-600">
      <p className="mb-4">
        Founded in 2024, EduSphere is dedicated to modernizing education administration. We believe that when schools run efficiently, teachers can focus on what matters most: teaching.
      </p>
      <p className="mb-8">
        Our platform integrates the latest in web technology and AI to provide actionable insights into student performance, automate mundane administrative tasks like fee collection, and foster better communication between the school and home.
      </p>
      
      <img src="https://picsum.photos/800/400" alt="School Campus" className="w-full h-64 object-cover rounded-xl shadow-md mb-8" />
      
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
      <ul className="space-y-3">
        {[
          "To empower educators with data-driven insights.",
          "To simplify the complexity of school management.",
          "To bridge the communication gap between parents and schools."
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const Contact: React.FC = () => (
  <div className="max-w-7xl mx-auto py-16 px-4">
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Contact Us</h1>
        <p className="text-lg text-slate-600 mb-8">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Users />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Support Team</p>
              <p className="text-slate-600">support@edusphere.com</p>
            </div>
          </div>
          {/* More contact info placeholders could go here */}
        </div>
      </div>
      
      <Card className="p-8">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32" placeholder="How can we help?"></textarea>
          </div>
          <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">Send Message</button>
        </form>
      </Card>
    </div>
  </div>
);
