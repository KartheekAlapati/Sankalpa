import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({ plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
    outDir: mode === 'phase1-test' ? '.phase1-dist' : mode === 'auth-test' ? '.auth-dist' : 'dist',
    modulePreload: {
      resolveDependencies: (filename, dependencies) => /LearningEntry|LearningWorkspace/.test(filename)
        ? dependencies.filter(dependency => /rolldown-runtime|question-index|storage/.test(dependency))
        : dependencies,
    },
  },
  ...(mode === 'auth-test' ? { define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://sankalpa-contract-test.supabase.co'),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify('sb_publishable_contract_test_only'),
  } } : {}),
}))
