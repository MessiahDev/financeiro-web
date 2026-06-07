import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AppRouter } from './router'

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouter />
      </NotificationProvider>
    </AuthProvider>
  )
}