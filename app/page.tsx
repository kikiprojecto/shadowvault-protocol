'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Zap, CheckCircle2, ArrowRight, FileText, Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Page() {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyProgramId = () => {
    navigator.clipboard.writeText('HKFDPxSMDTcMjNWnDR3u4YH5VKcxTKieV9snBY5HumBe')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    
    setRipples(prev => [...prev, { x, y, id }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 600)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Complex Gradient Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multi-layer gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0a1f] via-[#1a0b2e] to-[#0a0a0a]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7c3aed]/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#3b82f6]/15 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#06b6d4]/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Matrix-style grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Encrypted data stream effect */}
        <div className="absolute inset-0 opacity-5 overflow-hidden">
          <div className="absolute inset-0 font-mono text-xs text-purple-400 whitespace-pre animate-scroll-up leading-6">
            {`0x7c3aed 0x3b82f6 0x06b6d4 ENCRYPTED
0x4a5568 0x9333ea 0x8b5cf6 SHADOW
0x6366f1 0xa855f7 0xc084fc VAULT
0x7c3aed 0x3b82f6 0x06b6d4 PROTOCOL
0x4a5568 0x9333ea 0x8b5cf6 ARCIUM
0x6366f1 0xa855f7 0xc084fc SOLANA`.repeat(10)}
          </div>
        </div>
      </div>

      {/* Hero Section - Elite DeFi UI */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-32">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          
          {/* Clean Professional Logo */}
          <div className={`flex justify-center mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="relative group">
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Simple icon container */}
              <div className="relative w-20 h-20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <Shield className="w-20 h-20 text-white/90 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                <Lock className="absolute inset-0 m-auto w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-500" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Massive Heading with Staggered Animation */}
          <div className="space-y-6">
            <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="text-white">Shadow</span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">Vault</span>
              <span className="text-white/80 block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-4 lg:mt-6 font-light">Protocol</span>
            </h1>

            {/* Tagline */}
            <p className={`text-lg sm:text-xl md:text-2xl text-purple-300 font-medium max-w-3xl mx-auto transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Privacy-First Institutional DeFi on Solana
            </p>
          </div>

          {/* Description */}
          <p className={`text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Submit encrypted trade intents. Routing computed privately by Arcium MPC. Execute on-chain without revealing strategies.
          </p>

          {/* Premium CTA Buttons - Touch Friendly */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center pt-8 px-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Button 
              asChild 
              size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 sm:px-10 py-4 sm:py-6 min-h-[48px] text-base sm:text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            >
              <Link 
                href="/demo" 
                className="flex items-center justify-center gap-2"
                aria-label="Live Arcium Demo"
              >
                🔐 Live Demo
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-2 border-white/10 text-white hover:bg-white/5 hover:border-white/20 px-8 sm:px-10 py-4 sm:py-6 min-h-[48px] text-base sm:text-lg font-semibold rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              <a 
                href="https://explorer.solana.com/address/HKFDPxSMDTcMjNWnDR3u4YH5VKcxTKieV9snBY5HumBe?cluster=devnet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
                aria-label="View ShadowVault Protocol on Solana Explorer (opens in new tab)"
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                View on Explorer
              </a>
            </Button>
          </div>

          {/* Glassmorphism Trust Badges */}
          <div className={`flex flex-wrap justify-center gap-4 pt-16 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 cursor-default">
              <Lock className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300 font-medium">Encrypted by Arcium</span>
            </div>
            
            <div className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 cursor-default">
              <Zap className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300 font-medium">Built on Solana</span>
            </div>
            
            <div className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 hover:border-green-500/30 hover:bg-white/10 transition-all duration-300 cursor-default">
              <CheckCircle2 className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-slate-300 font-medium">Devnet Deployed</span>
            </div>
          </div>

          {/* Program ID with Copy */}
          <div className={`pt-12 transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Program ID</span>
              <code className="text-sm text-purple-300 font-mono">
                HKFDPxSMDTcMjNWnDR3u4YH5VKcxTKieV9snBY5HumBe
              </code>
              <button
                onClick={copyProgramId}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                aria-label="Copy Program ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-400 mt-2 animate-fade-in">Copied!</p>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Hyperliquid Glassmorphism Aesthetic */}
      <section className="relative z-10 py-32 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Privacy Without Compromise
            </span>
          </h2>
          
          {/* 3-Column Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Encrypted Execution - Purple Theme */}
            <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 transition-all duration-500">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Lock className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">
                🔒 Encrypted Execution
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                Trade intents encrypted via Arcium MPC. Strategies remain private on-chain through 32-byte hash commitments.
              </p>
              
              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-purple-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            {/* Card 2: Solana Speed - Blue Theme */}
            <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-500">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                ⚡ Solana Speed
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                Lightning-fast execution with sub-second finality. Low costs and institutional-grade performance.
              </p>
              
              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-500"></div>
            </div>

            {/* Card 3: MEV Protection - Green Theme */}
            <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/30 transition-all duration-500">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Shield className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                🛡️ MEV Protection
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 leading-relaxed">
                Prevent front-running and strategy leaks. Off-chain MPC computes optimal routes privately.
              </p>
              
              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-32 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-green-500/50"></div>

            {/* Step 1 */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-4 border-[#0a0a0a]">
                1
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Submit Intent</h3>
                <p className="text-gray-400 leading-relaxed">
                  User submits encrypted trade intent. Size, slippage, and strategy remain hidden on-chain.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl border-4 border-[#0a0a0a]">
                2
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">MPC Compute</h3>
                <p className="text-gray-400 leading-relaxed">
                  Arcium MPC network computes optimal routing across Jupiter, Raydium, Orca privately.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl border-4 border-[#0a0a0a]">
                3
              </div>
              <div className="pt-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Execute</h3>
                <p className="text-gray-400 leading-relaxed">
                  Smart contract verifies ZK proof and executes trade. Strategy never revealed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Info Section - OpenSea Polish */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Premium Glassmorphism Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-12">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
            
            <div className="relative space-y-10">
              {/* Header with Pulse Dot */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Live on Solana Devnet
                  </h2>
                </div>
                <p className="text-gray-400">Deployed and verified smart contract</p>
              </div>

              {/* Program ID Display */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Program ID</p>
                    <code className="text-sm md:text-base text-purple-300 font-mono break-all">
                      HKFDPxSMDTcMjNWnDR3u4YH5VKcxTKieV9snBY5HumBe
                    </code>
                  </div>
                  <button
                    onClick={copyProgramId}
                    className="flex-shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 group"
                    aria-label="Copy Program ID"
                  >
                    {copied ? (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">Copied!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Copy className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        <span className="text-sm text-gray-400 group-hover:text-white font-medium transition-colors">Copy</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* 4-Column Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Network */}
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Network</p>
                  <p className="text-white font-semibold">Solana</p>
                </div>

                {/* Framework */}
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Framework</p>
                  <p className="text-white font-semibold">Anchor</p>
                </div>

                {/* Status */}
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Status</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-green-400 font-semibold">Live</p>
                  </div>
                </div>

                {/* Deployed */}
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Deployed</p>
                  <p className="text-white font-semibold">Devnet</p>
                </div>
              </div>

              {/* Big CTA Button */}
              <div className="flex justify-center pt-4">
                <a
                  href="https://explorer.solana.com/address/HKFDPxSMDTcMjNWnDR3u4YH5VKcxTKieV9snBY5HumBe?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold text-lg shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300"
                >
                  <FileText className="w-5 h-5" />
                  View on Solana Explorer
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white">ShadowVault</span>
              </div>
              <p className="text-gray-400 text-sm">
                Privacy-first institutional DeFi aggregator on Solana using Arcium's encrypted compute.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/kikiprojecto/shadowvault-protocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://docs.arcium.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Arcium Docs
                  </a>
                </li>
                <li>
                  <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                    Solana
                  </a>
                </li>
              </ul>
            </div>

            {/* Built For */}
            <div>
              <h3 className="text-white font-semibold mb-4">Built For</h3>
              <p className="text-gray-400 text-sm mb-2">
                Arcium's &lt;encrypted&gt; Side Track
              </p>
              <p className="text-gray-400 text-sm">
                Cypherpunk Hackathon 2025
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>© 2025 ShadowVault Protocol. Built for privacy.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
