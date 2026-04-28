import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
