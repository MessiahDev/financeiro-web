import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { PreferencesProvider } from './contexts/PreferencesContext'
import { AppRouter } from './router'

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </PreferencesProvider>
    </AuthProvider>
  )
}

export default App