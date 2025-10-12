# 🎬 DEMO SCRIPT - ShadowVault Protocol

**Target Duration**: 2-3 minutes  
**Format**: Screen recording with voiceover  
**Audience**: Hackathon judges

---

## 🎯 **DEMO OBJECTIVES**

1. Show the **live deployed contract** on Solana Explorer
2. Demonstrate **working client** execution
3. Explain **privacy-preserving architecture**
4. Highlight **technical innovation**
5. Showcase **code quality**

---

## ⏱️ **TIMELINE BREAKDOWN**

| Time | Section | Duration |
|------|---------|----------|
| 0:00-0:20 | Introduction & Hook | 20s |
| 0:20-0:50 | Live Deployment Demo | 30s |
| 0:50-1:30 | Client Execution | 40s |
| 1:30-2:10 | Architecture Explanation | 40s |
| 2:10-2:30 | Code Quality & Wrap-up | 20s |

**Total**: 2:30 (Perfect length!)

---

## 📝 **SCRIPT**

### **[0:00-0:20] INTRODUCTION & HOOK** (20 seconds)

**VISUAL**: Show README.md with project title

**SCRIPT**:
> "Hi! I'm presenting ShadowVault Protocol - a privacy-preserving DeFi vault on Solana that lets users execute trading strategies without revealing them on-chain. Think of it as a vault where your strategy stays encrypted, but trades still execute optimally through off-chain MPC computation."

**KEY POINTS**:
- State project name clearly
- Mention "privacy-preserving" and "Solana"
- Hook: "encrypted strategies"

---

### **[0:20-0:50] LIVE DEPLOYMENT DEMO** (30 seconds)

**VISUAL**: Navigate to Solana Explorer

**ACTIONS**:
1. Open browser to: https://explorer.solana.com/address/HKFDPxSMDTcMjNWnDR3u4YH5VKcxTKieV9snBY5HumBe?cluster=devnet
2. Show the program account
3. Scroll to show it's verified and live

**SCRIPT**:
> "Here's our smart contract live on Solana Devnet. Program ID: HKF...umBe. You can see it's deployed, verified, and ready to use. The contract implements six core instructions: initialize vault, deposit, submit trade intent, execute trade, withdraw, and pause vault. All built with Anchor 0.29.0."

**KEY POINTS**:
- Show it's actually deployed (not just code)
- Mention it's on devnet
- List the 6 instructions quickly

---

### **[0:50-1:30] CLIENT EXECUTION** (40 seconds)

**VISUAL**: Switch to Solana Playground or terminal

**ACTIONS**:
1. Show Solana Playground with client.ts open
2. Click the "Run" button
3. Show output scrolling:
   - Wallet connected
   - Balance check
   - Program loaded
   - Vault initialization
   - Success messages

**SCRIPT**:
> "Let me show you the client in action. I'm running our TypeScript client in Solana Playground. Watch as it connects to the wallet, loads the program, and initializes a new vault with an encrypted strategy hash. See how it derives the vault PDA, creates the account, and emits events for transparency. The whole flow works seamlessly - deposit tokens, submit encrypted trade intents, and execute privately."

**KEY POINTS**:
- Show actual execution (not just code)
- Highlight "encrypted strategy hash"
- Mention PDAs and events
- Show it actually works!

---

### **[1:30-2:10] ARCHITECTURE EXPLANATION** (40 seconds)

**VISUAL**: Show ARCHITECTURE.md or code with comments

**ACTIONS**:
1. Open lib.rs in editor
2. Scroll to show structure:
   - Account definitions
   - Instructions
   - Events
   - Error codes
3. Highlight key security features

**SCRIPT**:
> "The architecture is designed for privacy from the ground up. Users submit encrypted trade intents - just a 32-byte hash commitment. The actual strategy computation happens off-chain via MPC, which we're designed to integrate with Arcium's network. On-chain, we only see the final execution result. Security-wise, we use PDA-based custody, owner-only controls, overflow-safe arithmetic, and comprehensive event emissions. All 554 lines of Rust code are fully documented with inline comments."

**KEY POINTS**:
- Explain the privacy model clearly
- Mention Arcium MPC integration potential
- Highlight security features
- Show code quality

---

### **[2:10-2:30] CODE QUALITY & WRAP-UP** (20 seconds)

**VISUAL**: Show documentation folder or README

**ACTIONS**:
1. Quick scroll through docs folder
2. Show README with badges
3. End on project title

**SCRIPT**:
> "We've built this with production quality in mind - over 80 pages of documentation, comprehensive test coverage, and zero compilation errors. The protocol is ready for integration with Arcium's MPC network to enable truly private DeFi trading. Thanks for watching - check out the full code and docs in our repository!"

**KEY POINTS**:
- Emphasize quality and completeness
- Mention Arcium integration again
- Clear call-to-action

---

## 🎥 **RECORDING SETUP**

### **Tools Needed**
- **Screen Recorder**: OBS Studio, Loom, or QuickTime
- **Microphone**: Built-in or external (test audio first!)
- **Browser**: Chrome/Firefox with tabs ready
- **Code Editor**: VS Code with files open

### **Pre-Recording Checklist**
- [ ] Close unnecessary browser tabs
- [ ] Clear terminal history
- [ ] Have all files open in editor
- [ ] Test microphone levels
- [ ] Practice script 2-3 times
- [ ] Set screen resolution (1920x1080 recommended)
- [ ] Turn off notifications
- [ ] Prepare water (for clear voice)

### **Recording Settings**
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 FPS
- **Audio**: 44.1kHz, clear speech
- **Format**: MP4 (most compatible)
- **Length**: Aim for 2:00-2:45

---

## 📋 **SHOT LIST**

### **Shot 1: Title Card** (3 seconds)
- Show README with project title
- Clear, centered, readable

### **Shot 2: Solana Explorer** (30 seconds)
- Full browser window
- Zoom to 100-125% for readability
- Scroll slowly to show details

### **Shot 3: Client Execution** (40 seconds)
- Split screen or full Playground view
- Show terminal output clearly
- Let output scroll naturally

### **Shot 4: Code Walkthrough** (40 seconds)
- Editor with syntax highlighting
- Zoom to 125-150% for code
- Scroll slowly, pause on key sections

### **Shot 5: Documentation** (15 seconds)
- Quick scroll through docs
- Show folder structure
- End on README

---

## 🎤 **VOICEOVER TIPS**

### **Delivery**
- **Pace**: Speak clearly, not too fast
- **Energy**: Enthusiastic but professional
- **Pauses**: Brief pauses between sections
- **Emphasis**: Stress key words (privacy, encrypted, MPC, Arcium)

### **Technical Terms**
- **PDA**: "Program Derived Address"
- **MPC**: "Multi-Party Computation"
- **IDL**: "Interface Definition Language"
- **SPL**: "Solana Program Library"

### **Avoid**
- ❌ "Um", "uh", "like", filler words
- ❌ Apologizing for anything
- ❌ Reading monotonously
- ❌ Going over 3 minutes

---

## 🎬 **RECORDING WORKFLOW**

### **Step 1: Setup** (5 minutes)
1. Open all required tabs/windows
2. Position windows for recording
3. Test screen recorder
4. Test microphone
5. Practice script once

### **Step 2: Record** (10-15 minutes)
1. Start recording
2. Take a breath
3. Begin script
4. If you mess up, pause and restart that section
5. Don't worry about perfection - natural is better
6. End recording

### **Step 3: Review** (5 minutes)
1. Watch the recording
2. Check audio levels
3. Verify all visuals are clear
4. If major issues, re-record
5. Minor issues are OK!

### **Step 4: Export** (2 minutes)
1. Export as MP4
2. Name: `shadowvault-demo.mp4`
3. Check file size (should be < 100MB)
4. Upload to YouTube/Loom

---

## 📤 **UPLOAD & SHARING**

### **YouTube Upload**
1. Go to youtube.com/upload
2. Upload `shadowvault-demo.mp4`
3. Title: "ShadowVault Protocol - Privacy-Preserving DeFi on Solana"
4. Description: Copy from README
5. Tags: solana, defi, privacy, blockchain, anchor, arcium
6. Visibility: **Unlisted** (for hackathon judges)
7. Get shareable link

### **Loom Upload** (Alternative)
1. Go to loom.com
2. Upload video
3. Set title and description
4. Get shareable link

### **Add to README**
Update README.md:
```markdown
## 🎥 Demo Video

Watch our 2-minute demo: [ShadowVault Protocol Demo](YOUR_VIDEO_LINK)
```

---

## ✅ **POST-RECORDING CHECKLIST**

- [ ] Video is 2-3 minutes long
- [ ] Audio is clear and audible
- [ ] All visuals are readable
- [ ] No sensitive information shown
- [ ] Uploaded to YouTube/Loom
- [ ] Link added to README
- [ ] Link added to submission form
- [ ] Tested link works (incognito mode)

---

## 🎯 **ALTERNATIVE: QUICK DEMO** (If Short on Time)

### **1-Minute Version**

**[0:00-0:15] Hook**
> "ShadowVault: Privacy-preserving DeFi vault on Solana. Encrypted trading strategies, MPC execution, live on devnet."

**[0:15-0:35] Show Deployment**
> "Here's the live contract on Solana Explorer - six instructions, fully deployed and verified."

**[0:35-0:55] Show Client**
> "Watch the client execute: wallet connects, vault initializes, encrypted strategy committed. All working seamlessly."

**[0:55-1:00] Wrap**
> "Production-quality code, comprehensive docs, ready for Arcium MPC integration. Check it out!"

---

## 💡 **PRO TIPS**

### **Make It Engaging**
- ✅ Start with a hook (problem/solution)
- ✅ Show, don't just tell
- ✅ Use "you" language ("you can see...")
- ✅ End with clear next steps

### **Technical Credibility**
- ✅ Show actual deployment (not mockups)
- ✅ Demonstrate working code
- ✅ Mention specific technologies
- ✅ Highlight security features

### **Hackathon Judges Care About**
- ✅ Does it actually work? (Show it!)
- ✅ Is it innovative? (Explain privacy model)
- ✅ Is the code quality good? (Show docs/tests)
- ✅ Can it integrate with Arcium? (Mention MPC)

---

## 🎬 **READY TO RECORD?**

### **Final Checklist**
- [ ] Script memorized (or on second monitor)
- [ ] All tabs/windows open
- [ ] Screen recorder ready
- [ ] Microphone tested
- [ ] Notifications off
- [ ] Water nearby
- [ ] Feeling confident!

### **Remember**
- Natural > Perfect
- Show > Tell
- Enthusiasm is contagious
- You've built something amazing!

---

**Now go record an awesome demo! You've got this! 🚀**

---

*Demo Script Version: 1.0*  
*Target Length: 2:30*  
*Difficulty: Easy*  
*Impact: High*
