import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Vote, Shield, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-30 md:w-96 md:h-96 animate-pulse-slow"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-30 md:w-96 md:h-96 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-30 md:w-96 md:h-96 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-24 mt-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block mb-6 relative"
          >
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-lg dark:opacity-50"></div>
            <h1 className="relative text-5xl md:text-7xl font-bold gradient-text pb-2">
              Blockchain e-Voting System
            </h1>
          </motion.div>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-zinc-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Secure, transparent, and tamper-proof voting powered by next-generation blockchain technology.
          </p>
          {!user && (
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register" className="btn-primary text-lg px-10 py-4 shadow-xl">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-10 py-4 shadow-lg">
                Sign In
              </Link>
            </motion.div>
          )}
          {user && (
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/dashboard" className="btn-primary text-lg px-10 py-4">
                Go to Dashboard
              </Link>
              <Link to="/elections" className="btn-secondary text-lg px-10 py-4">
                View Elections
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: <Shield className="w-12 h-12 mx-auto mb-6 text-blue-600 dark:text-blue-400" />, title: "Secure", desc: "Cryptographic encryption ensures your vote remains completely private and fundamentally secure." },
            { icon: <Lock className="w-12 h-12 mx-auto mb-6 text-indigo-600 dark:text-indigo-400" />, title: "Transparent", desc: "A public blockchain ledger allows anyone to cryptographically verify election integrity." },
            { icon: <CheckCircle className="w-12 h-12 mx-auto mb-6 text-purple-600 dark:text-purple-400" />, title: "Tamper-Proof", desc: "Decentralized, immutable records prevent all forms of modern fraud and manipulation." }
          ].map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -8 }} className="glass-card text-center group">
              <div className="transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div variants={itemVariants} className="glass-card-strong pb-12 pt-10 px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 dark:opacity-20"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-slate-900 dark:text-white">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              { step: 1, title: "Register", desc: "Create your account and securely verify your identity." },
              { step: 2, title: "Review", desc: "Browse active elections and research the candidates." },
              { step: 3, title: "Vote", desc: "Cast your encrypted vote directly onto the blockchain." },
              { step: 4, title: "Verify", desc: "View the transparent, immutable election results live." }
            ].map((item, idx) => (
              <motion.div key={idx} variants={itemVariants} className="text-center flex flex-col items-center h-full group">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:border-blue-500/50 transition-colors duration-300">
                  <span className="text-xl font-bold gradient-text">{item.step}</span>
                </div>
                <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;

