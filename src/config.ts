// Centralized configuration for Ask Mian
// Update these values and they reflect everywhere on the site and bot

export const BANK_DETAILS = {
  // ==== UPDATE THESE WITH YOUR REAL BANK DETAILS ====
  name: 'RAKBANK (RAK)',
  accountName: 'ASK MIAN LLC',
  accountNumber: '0303698014001',      // <-- UPDATE: Your real account number
  iban: 'AE770400000303698014001',  // <-- UPDATE: Your real IBAN
  swift: 'NRAKAEAK',                // <-- UPDATE: Your SWIFT code (if available)
  branch: 'Abu Dhabi Main Branch',  // <-- UPDATE: Your branch name
}

export const COMPANY_INFO = {
  name: 'ASK MIAN LLC',
  phone: '+971 55 868 9543',
  whatsapp: '971558689543',
  email: 'askmian.llc@gmail.com',
  address: 'Office on Appointment, Abu Dhabi, UAE',
  tradeLicense: '5038098',
  workingHours: 'Mon - Fri: 9:00 AM - 9:00 PM',
}

export const VISA_PRICES = {
  '30-Day Visit Visa': 1200,
  '60-Day Visit Visa': 1800,
  'Visa Extension': 1100,
  'Inside Country Status Change': 0, // Price on request
  'PRO Services': 0, // Price on request
}

// API URL configuration for hybrid deployment
// Railway backend URL - update after Railway deploy
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://your-railway-app.up.railway.app/api/trpc' : '/api/trpc')
