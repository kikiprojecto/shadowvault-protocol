# 🎯 HOW TO RUN CLIENT IN SOLANA PLAYGROUND

## ❌ **THE ERROR YOU'RE SEEING**

```
$ ts client-simple.ts
bash error: Command 'ts' not found.
```

**Why?** The `ts` command doesn't exist in Solana Playground's terminal.

---

## ✅ **CORRECT WAY TO RUN CLIENT**

### **Method 1: Use the Run Button (Recommended)**

1. **Open your client file** in Solana Playground
   - Click on `client.ts` in the left sidebar under "Client" section

2. **Click the Run button** ▶️
   - Look for the **Run** button next to the filename
   - It's usually near the "Test" button

3. **Wait for execution**
   - The output will appear in the bottom terminal
   - You'll see the script running step by step

---

## 📋 **STEP-BY-STEP VISUAL GUIDE**

### **Step 1: Locate Your Client File**

In the left sidebar, you should see:
```
Client
  ▶ Run  🧪 Test
  ▼ client
    📄 client.ts
```

### **Step 2: Click the Run Button**

Click the **▶ Run** button (NOT the terminal!)

### **Step 3: Watch Output**

The bottom panel will show:
```
Running client...
client.ts:
============================================================
🛡️  ShadowVault Protocol - Simple Demo
============================================================

📍 Step 1: Checking wallet connection...
✅ Wallet connected
...
```

---

## 🚫 **DON'T USE TERMINAL COMMANDS**

**These will NOT work in Solana Playground:**
```bash
❌ ts client.ts
❌ node client.ts
❌ npm start
❌ ts-node client.ts
```

**Why?** Solana Playground has its own execution environment. You must use the UI buttons.

---

## 🔧 **IF RUN BUTTON DOESN'T WORK**

### **Option 1: Refresh Page**
1. Press F5 or click refresh
2. Wait for page to reload
3. Try clicking Run again

### **Option 2: Check File Location**
Make sure your `client.ts` is in the correct location:
- Should be under "Client" section in left sidebar
- NOT in "tests" folder
- NOT in "src" folder

### **Option 3: Recreate Client File**
1. Delete the existing `client.ts`
2. Create new file: Click "+" next to "client" folder
3. Name it `client.ts`
4. Copy the content from `client-simple.ts`
5. Save (Ctrl+S)
6. Click Run

---

## 📝 **CORRECT FILE STRUCTURE IN PLAYGROUND**

Your Solana Playground should look like this:

```
shadowvault/
├── Program
│   ├── 🔨 Build
│   ├── 🚀 Deploy
│   └── src/
│       └── lib.rs          ← Your smart contract
├── Client
│   ├── ▶ Run              ← CLICK THIS!
│   ├── 🧪 Test
│   └── client/
│       └── client.ts       ← Your client script
└── tests/
    └── anchor.test.ts
```

---

## ✅ **WHAT TO DO RIGHT NOW**

1. **Close the terminal** (you don't need it)
2. **Click on `client.ts`** in the left sidebar
3. **Find the Run button** (▶) - it's near the top
4. **Click Run**
5. **Watch the output** in the bottom panel

---

## 🎯 **EXPECTED OUTPUT**

When you click Run correctly, you should see:

```
Running client...
client.ts:
============================================================
🛡️  ShadowVault Protocol - Simple Demo
============================================================

📍 Step 1: Checking wallet connection...
✅ Wallet connected
   Address: <your-address>

📍 Step 2: Checking wallet balance...
✅ Balance: 5.0000 SOL

📍 Step 3: Loading program...
✅ Program ID: <program-id>
✅ Program loaded successfully

📍 Step 4: Deriving vault address...
✅ Vault PDA: <vault-address>
✅ Bump: 255

📍 Step 5: Checking if vault exists...
ℹ️  Vault does not exist yet

📍 Step 6: Initializing new vault...
   Sending transaction...
✅ Vault initialized successfully!

🎉 Demo Complete!
```

---

## 🆘 **STILL NOT WORKING?**

### **Check These:**

1. **Is wallet connected?**
   - Look for green "Connected" at bottom-left
   - If not, click wallet icon and connect

2. **Is program deployed?**
   - Click "Build" first
   - Then click "Deploy"
   - Wait for success message

3. **Is the file saved?**
   - Press Ctrl+S to save
   - Look for unsaved indicator (dot on filename)

4. **Is it the right file?**
   - Make sure you're running `client.ts` not `lib.rs`
   - Client files go in "Client" section, not "Program"

---

## 💡 **PRO TIP**

**You can also use the Test button** (🧪) if you have test files, but for the client demo, use the **Run button** (▶).

---

## 📞 **QUICK REFERENCE**

| Action | How To Do It |
|--------|--------------|
| **Run client** | Click ▶ Run button |
| **Build program** | Click 🔨 Build button |
| **Deploy program** | Click 🚀 Deploy button |
| **Run tests** | Click 🧪 Test button |
| **Connect wallet** | Click wallet icon (bottom-left) |
| **View output** | Look at bottom terminal panel |

---

**Now go click that Run button!** ▶️ 🚀

---

*Last Updated: 2025-10-10*  
*For: Solana Playground (beta.solpg.io)*
