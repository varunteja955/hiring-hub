import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Users, FileText, Zap, Briefcase, Shield, Globe } from 'lucide-react'

const features = [
  { icon: FileText, title: 'AI Resume Screening', desc: 'Automated resume parsing and skill matching with 90% accuracy' },
  { icon: Zap, title: 'Smart Matching', desc: 'AI matches candidates to jobs based on skills & experience' },
  { icon: Users, title: 'Dual Dashboards', desc: 'Separate dashboards for students and companies' },
  { icon: Shield, title: 'Secure & Fast', desc: 'JWT authentication with role-based access' },
]

const stats = [
  { number: '10K+', label: 'Active Jobs' },
  { number: '50K+', label: 'Candidates' },
  { number: '500+', label: 'Companies' },
  { number: '95%', label: 'Match Rate' },
]

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-dark-bg to-cyan-900/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjQgMC0xMiA1LjM3Ni0xMiAxMnM1LjM3NiAxMiAxMiAxMiAxMi01LjM3NiAxMi0xMiAyNS41MTQtMTIgMTJjLTYuNjI0IDAtMTItNS4zNzYtMTItMTJzNS4zNzYtMTIgMTItMTJjNi42MjQgMCAxMi01LjM3NiAxMi0xMnMtNS4zNzYtMTItMTItMTJjNi42MjQgMCAxMi01LjM3NiAxMi0xMnMtNS4zNzYtMTItMTItMTJ6bTAgMzJjLTYuNjI0IDAtMTIgNS4zNzYtMTIgMTJzNS4zNzYgMTIgMTIgMTIgMTItNS4zNzYgMTItMTIgMjUuNTE0LTEyIDEyYy02LjYyNCAwLTEyLTUuMzc2LTEyLTEyczUuMzc2LTEyIDEyLTEyYzYuNjI0IDAgMTItNS4zNzYgMTItMTJzNS4zNzYtMTIgMTItMTJjNi42MjQgMCAxMi01LjM3NiAxMi0xMnMtNS4zNzYtMTItMTItMTJ6IiBmaWxsPSIjMzg4M2I5Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              🚀 Next-Gen Hiring Platform
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Smart Hiring with{' '}
            <span className="gradient-text">AI Power</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Transform your hiring process with AI-powered resume screening, 
            automatic candidate matching, and smart notifications.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup" className="btn-primary inline-flex items-center justify-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/jobs" className="btn-secondary inline-flex items-center justify-center">
              Browse Jobs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="gradient-text">AI Features</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need for smart hiring
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card text-center py-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Hiring?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Join thousands of companies and candidates using AI to find the perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary">Start Hiring Smart</Link>
              <Link to="/signup" className="btn-secondary">Find Your Dream Job</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">HireHub</span>
          </div>
          <p className="text-gray-500">© 2024 HireHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}