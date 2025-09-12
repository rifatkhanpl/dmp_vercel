# Development Guidelines & Best Practices

## 🎯 **Core Principle: Measure Twice, Cut Once**
Always verify before implementing. Prevention is better than debugging.

## 📋 **Pre-Development Checklist**

### **Before Creating/Modifying Any Component:**
- [ ] Plan the component name and ensure it matches the file purpose
- [ ] Map out the file structure to determine correct import paths
- [ ] Verify all dependencies exist before importing them
- [ ] Check if similar components exist to avoid duplication

### **File Naming & Export Rules:**
```typescript
// ✅ CORRECT: File name matches main export
// File: src/components/Auth/SignIn.tsx
export function SignIn() { ... }

// ❌ WRONG: Mismatched names
// File: src/components/Auth/SignIn.tsx  
export function LandingPage() { ... }
```

### **Import Path Verification:**
```
src/
├── App.tsx                    → import from "./contexts/..."
├── contexts/
│   └── AuthContext.tsx       → import from "../components/..."
└── components/
    └── Auth/
        └── SignIn.tsx        → import from "../../contexts/..."
```
**Rule:** Count directory levels - each `../` goes up one level.

## 🔄 **Copy-Paste Safety Protocol**
When copying components (major source of errors):
1. **Immediately rename** the export function
2. **Update component logic** to match new purpose  
3. **Verify imports** are correct for new location
4. **Test component** loads without errors

## ✅ **Post-Change Verification (The Two-Minute Rule)**
After ANY change:
- [ ] Check export name matches file purpose
- [ ] Verify all import paths are correct
- [ ] Run `npm run dev` - check for compilation errors
- [ ] Open browser - verify pages load
- [ ] Check browser console for runtime errors
- [ ] Test key user flows if applicable

## 🚨 **Error Pattern Recognition**
- `does not provide an export named` → Export/import mismatch
- `Cannot resolve module` → Wrong import path  
- `Unexpected token` → Syntax error (often copy-paste issue)

## 📁 **File Organization Standards**
```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Reusable layout components  
│   └── Pages/          # Full page components
├── contexts/           # React contexts
├── services/           # API/external services
└── types/              # TypeScript definitions
```

## 🎯 **Component Creation Checklist**
- [ ] Export name matches file purpose
- [ ] All imports use correct relative paths
- [ ] Component implements what name suggests
- [ ] TypeScript types properly defined
- [ ] No unused imports or exports

## 🔍 **Systematic Review Triggers**
Conduct systematic review when:
- Multiple files changed
- Import/export errors encountered
- After major refactoring
- Before significant new features

## 💡 **Key Mantras**
1. **"File name = Export name = Component purpose"**
2. **"Map the path before you import"**
3. **"Two minutes of verification saves hours of debugging"**
4. **"When in doubt, systematic review"**

---
*Follow these guidelines religiously to maintain code quality and prevent cascading errors.*