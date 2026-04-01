import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isProjectPagesBuild =
  process.env.GITHUB_ACTIONS === 'true' &&
  Boolean(repositoryName) &&
  !repositoryName?.toLowerCase().endsWith('.github.io')

// https://vite.dev/config/
export default defineConfig({
  base: isProjectPagesBuild && repositoryName ? `/${repositoryName}/` : '/',
  plugins: [react()],
  preview: {
    allowedHosts: true,
  },
})
